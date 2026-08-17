"""Export the selected cardiovascular model for the local web tool.

This script mirrors the selected modelling notebook:
- clinical_bands logistic regression
- train plus validation fit
- 0.35 probability threshold

It writes a JavaScript file that can be opened locally without a backend.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    brier_score_loss,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


PROJECT_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_DIR / "01_data" / "processed" / "cardio_cleaned.csv"
TABLES_DIR = PROJECT_DIR / "04_outputs" / "tables"
APP_DIR = PROJECT_DIR / "05_app"
OUTPUT_PATH = APP_DIR / "model_spec.js"

RANDOM_STATE = 42
THRESHOLD = 0.35

NUMERIC_FEATURES = [
    "age_years",
    "bmi",
    "ap_hi",
    "ap_lo",
    "pulse_pressure",
    "mean_arterial_pressure",
]

CATEGORICAL_FEATURES = [
    "gender",
    "age_band",
    "age_decade",
    "bmi_category",
    "systolic_bp_category",
    "diastolic_bp_category",
    "pulse_pressure_band",
    "cholesterol",
    "gluc",
    "smoke",
    "alco",
    "active",
]


def make_one_hot_encoder() -> OneHotEncoder:
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def add_modelling_features(df: pd.DataFrame) -> pd.DataFrame:
    output = df.copy()
    output["mean_arterial_pressure"] = output["ap_lo"] + (output["pulse_pressure"] / 3)
    output["bp_ratio"] = output["ap_hi"] / output["ap_lo"]
    output["age_decade"] = pd.cut(
        output["age_years"],
        bins=[0, 40, 45, 50, 55, 60, 120],
        labels=["<40", "40-44", "45-49", "50-54", "55-59", "60+"],
        right=False,
    )
    output["pulse_pressure_band"] = pd.cut(
        output["pulse_pressure"],
        bins=[-np.inf, 40, 60, 80, np.inf],
        labels=["<40", "40-59", "60-79", "80+"],
        right=False,
    )
    return output


def build_pipeline() -> Pipeline:
    numeric_pipeline = Pipeline(
        [
            ("impute", SimpleImputer(strategy="median")),
            ("scale", StandardScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, NUMERIC_FEATURES),
            ("categorical", make_one_hot_encoder(), CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )

    return Pipeline(
        [
            ("preprocess", preprocessor),
            (
                "model",
                LogisticRegression(
                    max_iter=4000,
                    solver="lbfgs",
                    C=0.1,
                    class_weight="balanced",
                ),
            ),
        ]
    )


def rounded(value: float, digits: int = 10) -> float:
    return round(float(value), digits)


def record_rate_lookup(path: Path) -> list[dict[str, object]]:
    if not path.exists():
        return []
    rates = pd.read_csv(path)
    return [
        {
            "feature": str(row["feature"]),
            "group": str(row["group"]),
            "records": int(row["records"]),
            "rate": rounded(row["cardiovascular_disease_rate"], 4),
        }
        for _, row in rates.iterrows()
    ]


def read_csv_records(path: Path) -> list[dict[str, object]]:
    if not path.exists():
        return []
    return pd.read_csv(path).to_dict(orient="records")


def main() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)

    cardio_df = pd.read_csv(DATA_PATH)
    model_df = add_modelling_features(cardio_df)
    y = model_df["cardio"]

    train_valid_df, test_df, y_train_valid, y_test = train_test_split(
        model_df,
        y,
        test_size=0.20,
        stratify=y,
        random_state=RANDOM_STATE,
    )

    final_model = build_pipeline()
    final_model.fit(train_valid_df, y_train_valid)

    probabilities = final_model.predict_proba(test_df)[:, 1]
    predictions = (probabilities >= THRESHOLD).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_test, predictions).ravel()

    preprocessor = final_model.named_steps["preprocess"]
    numeric_pipeline = preprocessor.named_transformers_["numeric"]
    categorical_encoder = preprocessor.named_transformers_["categorical"]
    model = final_model.named_steps["model"]

    imputer = numeric_pipeline.named_steps["impute"]
    scaler = numeric_pipeline.named_steps["scale"]

    spec = {
        "project": "Cardiovascular Disease Risk Explorer",
        "modelFamily": "Binary logistic regression",
        "selectedCandidate": "clinical_bands",
        "threshold": THRESHOLD,
        "positiveClass": "cardio = 1, cardiovascular disease present",
        "datasetSummary": {
            "cleanedRows": int(len(cardio_df)),
            "overallDiseaseRate": rounded(cardio_df["cardio"].mean(), 4),
            "inputRanges": {
                column: {
                    "min": rounded(cardio_df[column].min(), 2),
                    "median": rounded(cardio_df[column].median(), 2),
                    "max": rounded(cardio_df[column].max(), 2),
                }
                for column in ["age_years", "height_cm", "weight_kg", "bmi", "ap_hi", "ap_lo"]
            },
        },
        "numericFeatures": NUMERIC_FEATURES,
        "categoricalFeatures": CATEGORICAL_FEATURES,
        "numeric": {
            feature: {
                "median": rounded(imputer.statistics_[index]),
                "mean": rounded(scaler.mean_[index]),
                "scale": rounded(scaler.scale_[index]),
            }
            for index, feature in enumerate(NUMERIC_FEATURES)
        },
        "categorical": {
            feature: [category.item() if hasattr(category, "item") else category for category in categories]
            for feature, categories in zip(CATEGORICAL_FEATURES, categorical_encoder.categories_)
        },
        "intercept": rounded(model.intercept_[0]),
        "coefficients": [rounded(value) for value in model.coef_[0]],
        "transformedFeatureNames": list(preprocessor.get_feature_names_out()),
        "testMetrics": {
            "accuracy": rounded(accuracy_score(y_test, predictions), 4),
            "precision": rounded(precision_score(y_test, predictions), 4),
            "recall": rounded(recall_score(y_test, predictions), 4),
            "f1": rounded(f1_score(y_test, predictions), 4),
            "rocAuc": rounded(roc_auc_score(y_test, probabilities), 4),
            "averagePrecision": rounded(average_precision_score(y_test, probabilities), 4),
            "brierScore": rounded(brier_score_loss(y_test, probabilities), 4),
            "trueNegative": int(tn),
            "falsePositive": int(fp),
            "falseNegative": int(fn),
            "truePositive": int(tp),
            "testRecords": int(len(test_df)),
        },
        "edaRates": record_rate_lookup(TABLES_DIR / "cardio_eda_group_rate_summary.csv"),
        "featureEffects": read_csv_records(TABLES_DIR / "model_10_feature_effects.csv"),
    }

    js = (
        "window.CARDIO_MODEL_SPEC = "
        + json.dumps(spec, indent=2)
        + ";\n"
    )
    OUTPUT_PATH.write_text(js, encoding="utf-8")
    print(f"Exported model spec to {OUTPUT_PATH}")
    print(
        "Metrics: "
        f"accuracy={spec['testMetrics']['accuracy']}, "
        f"precision={spec['testMetrics']['precision']}, "
        f"recall={spec['testMetrics']['recall']}, "
        f"f1={spec['testMetrics']['f1']}, "
        f"roc_auc={spec['testMetrics']['rocAuc']}"
    )


if __name__ == "__main__":
    main()

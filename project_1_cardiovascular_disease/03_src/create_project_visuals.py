"""Create selected Project 1 visuals for the portfolio and README.

This script creates the cardiovascular architecture diagram and EDA rate
charts. It does not change the model or data; it only updates presentation
outputs from existing project artefacts.
"""

from __future__ import annotations

import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch
from matplotlib.ticker import PercentFormatter
import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
CHARTS_DIR = ROOT / "04_outputs" / "charts"
TABLES_DIR = ROOT / "04_outputs" / "tables"
CLEANED_DATA = ROOT / "01_data" / "processed" / "cardio_cleaned.csv"
EDA_SUMMARY = TABLES_DIR / "cardio_eda_group_rate_summary.csv"
FEATURE_EFFECTS = TABLES_DIR / "model_10_feature_effects.csv"

BG = "#080b10"
TEXT = "#f5f2df"
MUTED = "#c8c4a8"
ACCENT = "#2df6d6"
DATA_EDGE = "#d4d0b5"
MODEL_EDGE = "#8492dd"
MODEL_TEXT = "#c7cdfd"
DATA_FILL = "#12161d"
MODEL_FILL = "#101524"
OUTPUT_FILL = "#101726"


def add_box(ax, x, y, w, h, title, lines, kind="data"):
    edge = MODEL_EDGE if kind in {"model", "output"} else DATA_EDGE
    fill = MODEL_FILL if kind == "model" else OUTPUT_FILL if kind == "output" else DATA_FILL
    title_colour = MODEL_TEXT if kind in {"model", "output"} else TEXT

    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.04",
        linewidth=1.6,
        edgecolor=edge,
        facecolor=fill,
    )
    ax.add_patch(patch)
    ax.text(x + w / 2, y + h - 0.27, title, ha="center", va="top", color=title_colour, fontsize=10.4, fontweight="bold")
    for idx, line in enumerate(lines):
        ax.text(x + w / 2, y + h - 0.54 - idx * 0.18, line, ha="center", va="top", color=MUTED, fontsize=7.8)


def arrow(ax, start, end):
    ax.add_patch(
        FancyArrowPatch(
            start,
            end,
            arrowstyle="-|>",
            mutation_scale=14,
            linewidth=1.6,
            color=ACCENT,
            shrinkA=2,
            shrinkB=2,
        )
    )


def elbow(ax, points):
    for start, end in zip(points[:-2], points[1:-1]):
        ax.plot([start[0], end[0]], [start[1], end[1]], color=MODEL_EDGE, linewidth=1.4)
    arrow(ax, points[-2], points[-1])


def make_architecture_diagram():
    fig, ax = plt.subplots(figsize=(18, 10), dpi=160)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10)
    ax.axis("off")

    ax.text(
        9,
        9.48,
        "Cardiovascular Disease Prediction - Project Architecture",
        ha="center",
        va="center",
        color=TEXT,
        fontsize=22,
        fontweight="bold",
    )

    boxes = {
        "source": (0.7, 7.75, 2.25, 0.86, "Data Source", ["Kaggle public dataset"], "data"),
        "raw": (0.7, 6.55, 2.25, 0.98, "Raw Data", ["cardio_data.csv", "70,000 records"], "data"),
        "inspect": (0.7, 5.18, 2.32, 1.14, "Data Inspection", ["Shape and data types", "Missing and duplicate checks", "Quality flags"], "data"),
        "clean": (0.7, 3.78, 2.32, 1.14, "Data Cleaning", ["Remove invalid values", "Fix impossible BP records", "Keep valid high-risk values"], "data"),
        "cleaned": (3.6, 3.78, 2.32, 1.14, "Cleaned Dataset", ["68,650 records", "Prepared for EDA and model"], "data"),
        "eda": (3.6, 2.02, 2.32, 1.14, "EDA", ["Target balance", "Rates by age, BP and BMI", "Visual evidence"], "data"),
        "features": (6.5, 3.78, 2.32, 1.14, "Feature Engineering", ["Age in years", "BMI and BP bands", "Pulse pressure fields"], "data"),
        "prep": (6.5, 5.18, 2.32, 1.14, "Preprocessing", ["Scale numeric fields", "One-hot encode categories", "Pipeline ready"], "model"),
        "split": (9.4, 5.18, 2.32, 1.14, "Train / Validate / Test", ["Stratified split", "60% / 20% / 20%"], "model"),
        "candidates": (9.4, 3.78, 2.32, 1.14, "Model Candidates", ["Logistic regression variants", "Validation comparison"], "model"),
        "threshold": (9.4, 2.02, 2.32, 1.14, "Threshold Selection", ["0.35 selected", "Recall prioritised"], "model"),
        "final": (12.3, 2.02, 2.32, 1.14, "Final Model", ["Logistic regression", "Clinical-style bands"], "model"),
        "validation": (12.3, 3.78, 2.32, 1.14, "Model Validation", ["Held-out test set", "Confusion matrix and ROC"], "model"),
        "metrics": (12.3, 5.18, 2.32, 1.14, "Model Outputs", ["Accuracy 70.5% | Recall 81.6%", "F1 73.2% | ROC-AUC 0.795"], "output"),
        "importance": (15.2, 5.18, 2.32, 1.14, "Feature Effects", ["Systolic BP category", "Age and cholesterol"], "output"),
        "checker": (15.2, 3.78, 2.32, 1.14, "Checker Prototype", ["Static web page", "User-facing explanation"], "output"),
    }

    for x, y, w, h, title, lines, kind in boxes.values():
        add_box(ax, x, y, w, h, title, lines, kind)

    def right(key):
        x, y, w, h, *_ = boxes[key]
        return (x + w, y + h / 2)

    def left(key):
        x, y, w, h, *_ = boxes[key]
        return (x, y + h / 2)

    def top(key):
        x, y, w, h, *_ = boxes[key]
        return (x + w / 2, y + h)

    def bottom(key):
        x, y, w, h, *_ = boxes[key]
        return (x + w / 2, y)

    arrow(ax, bottom("source"), top("raw"))
    arrow(ax, bottom("raw"), top("inspect"))
    arrow(ax, bottom("inspect"), top("clean"))
    arrow(ax, right("clean"), left("cleaned"))
    arrow(ax, bottom("cleaned"), top("eda"))
    arrow(ax, right("cleaned"), left("features"))
    arrow(ax, top("features"), bottom("prep"))
    arrow(ax, right("prep"), left("split"))
    arrow(ax, bottom("split"), top("candidates"))
    arrow(ax, bottom("candidates"), top("threshold"))
    arrow(ax, right("threshold"), left("final"))
    arrow(ax, top("final"), bottom("validation"))
    arrow(ax, top("validation"), bottom("metrics"))
    arrow(ax, right("metrics"), left("importance"))
    arrow(ax, bottom("importance"), top("checker"))

    svg_path = CHARTS_DIR / "cardio_project_architecture_diagram.svg"
    png_path = CHARTS_DIR / "cardio_project_architecture_diagram.png"
    fig.savefig(svg_path, facecolor=BG, bbox_inches="tight")
    fig.savefig(png_path, facecolor=BG, bbox_inches="tight")
    plt.close(fig)


RISK_PALETTE = ["#69B981", "#A6D96A", "#FFD34D", "#FF8A2A", "#EF4444"]


def risk_colours(count: int) -> list[str]:
    """Map ordered chart groups to a consistent low-to-very-high colour story."""
    if count <= 1:
        return [RISK_PALETTE[2]]
    if count == 2:
        return [RISK_PALETTE[0], RISK_PALETTE[4]]
    if count == 3:
        return [RISK_PALETTE[0], RISK_PALETTE[2], RISK_PALETTE[4]]
    if count == 4:
        return RISK_PALETTE[:4]
    return RISK_PALETTE[:count]


GROUP_ORDER = {
    "age_band": ["Under 40", "40-49", "50-59", "60+"],
    "systolic_bp_category": ["<120", "120-129", "130-139", "140-159", "160+"],
    "diastolic_bp_category": ["<80", "80-89", "90-99", "100-109", "110+"],
    "bmi_category": ["Underweight", "Healthy weight", "Overweight", "Obesity", "Severe obesity"],
    "cholesterol_label": ["Normal", "Above normal", "Well above normal"],
    "glucose_label": ["Normal", "Above normal", "Well above normal"],
    "active_label": ["Yes", "No"],
}


def make_target_distribution_chart():
    cleaned_df = pd.read_csv(CLEANED_DATA, usecols=["cardio"])
    target_labels = {
        0: "No cardiovascular disease",
        1: "Cardiovascular disease",
    }
    target_counts = cleaned_df["cardio"].value_counts().reindex([0, 1])
    target_share = target_counts / target_counts.sum()
    target_table = pd.DataFrame(
        {
            "cardio_label": [target_labels[value] for value in target_counts.index],
            "records": target_counts.values,
            "share": target_share.values,
        }
    )

    fig, ax = plt.subplots(figsize=(8.8, 5.2), dpi=160)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_axisbelow(True)

    bars = ax.bar(
        target_table["cardio_label"],
        target_table["records"],
        width=0.46,
        color=["#2F4858", "#0F766E"],
        edgecolor="none",
        zorder=3,
    )

    for bar, records, share in zip(bars, target_table["records"], target_table["share"]):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            records + 520,
            f"{records:,.0f}\n({share:.1%})",
            ha="center",
            va="bottom",
            fontsize=10,
            color="#111827",
            fontweight="bold",
        )

    ax.set_title("Target distribution after cleaning", fontsize=16, fontweight="bold", pad=12)
    ax.set_xlabel("Cardiovascular disease status", fontsize=11)
    ax.set_ylabel("Number of records", fontsize=11)
    ax.grid(axis="y", color="#9ca3af", linewidth=0.45, alpha=0.18, linestyle=(0, (4, 6)), zorder=0)
    ax.grid(axis="x", visible=False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#111827")
    ax.spines["bottom"].set_color("#111827")
    ax.set_ylim(0, target_table["records"].max() * 1.16)
    fig.tight_layout()
    fig.savefig(CHARTS_DIR / "eda_01_target_distribution_after_cleaning.png", bbox_inches="tight")
    plt.close(fig)


def make_rate_chart(summary, cleaned_df, feature, title, xlabel, output_name):
    feature_df = summary.loc[summary["feature"] == feature].copy()
    if feature in GROUP_ORDER:
        feature_df["group"] = pd.Categorical(feature_df["group"], categories=GROUP_ORDER[feature], ordered=True)
        feature_df = feature_df.sort_values("group")
    overall_rate = cleaned_df["cardio"].mean()
    colours = risk_colours(len(feature_df))

    fig, ax = plt.subplots(figsize=(10.6, 5.4), dpi=160)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_axisbelow(True)

    ax.axhline(
        overall_rate,
        color="#8f98a8",
        linestyle=(0, (4, 4)),
        linewidth=1.15,
        alpha=0.55,
        zorder=1,
    )

    bars = ax.bar(
        feature_df["group"],
        feature_df["cardiovascular_disease_rate"],
        width=0.46,
        color=colours,
        edgecolor="none",
        zorder=2,
    )

    ax.text(
        len(feature_df) - 0.28,
        overall_rate + 0.012,
        f"Dataset average {overall_rate:.1%}",
        ha="right",
        va="bottom",
        color="#7c8798",
        fontsize=9,
        alpha=0.9,
        zorder=3,
    )

    for bar, rate in zip(bars, feature_df["cardiovascular_disease_rate"]):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            rate + 0.012,
            f"{rate:.1%}",
            ha="center",
            va="bottom",
            color="#111827",
            fontsize=10,
            fontweight="bold",
        )

    ax.set_title(title, fontsize=16, fontweight="bold", pad=12)
    ax.set_xlabel(xlabel, fontsize=11)
    ax.set_ylabel("Cardiovascular disease rate", fontsize=11)
    ax.yaxis.set_major_formatter(PercentFormatter(1.0, decimals=0))
    ax.grid(axis="y", color="#9ca3af", linewidth=0.7, alpha=0.26, linestyle=(0, (4, 3)))
    ax.grid(axis="x", visible=False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#111827")
    ax.spines["bottom"].set_color("#111827")
    ax.tick_params(axis="x", labelrotation=0)
    ax.set_ylim(0, min(1.0, max(feature_df["cardiovascular_disease_rate"].max() + 0.12, overall_rate + 0.1)))
    fig.tight_layout()
    fig.savefig(CHARTS_DIR / output_name, bbox_inches="tight")
    plt.close(fig)


def make_eda_charts():
    summary = pd.read_csv(EDA_SUMMARY)
    cleaned_df = pd.read_csv(CLEANED_DATA, usecols=["cardio"])

    make_rate_chart(summary, cleaned_df, "age_band", "Cardiovascular disease rate by age band", "Age band", "eda_02_rate_by_age_band.png")
    make_rate_chart(summary, cleaned_df, "systolic_bp_category", "Cardiovascular disease rate by systolic blood pressure category", "Systolic blood pressure category", "eda_03_rate_by_systolic_bp_category.png")
    make_rate_chart(summary, cleaned_df, "diastolic_bp_category", "Cardiovascular disease rate by diastolic blood pressure category", "Diastolic blood pressure category", "eda_04_rate_by_diastolic_bp_category.png")
    make_rate_chart(summary, cleaned_df, "bmi_category", "Cardiovascular disease rate by BMI category", "BMI category", "eda_05_rate_by_bmi_category.png")
    make_rate_chart(summary, cleaned_df, "cholesterol_label", "Cardiovascular disease rate by cholesterol group", "Cholesterol group", "eda_06_rate_by_cholesterol.png")
    make_rate_chart(summary, cleaned_df, "glucose_label", "Cardiovascular disease rate by glucose group", "Glucose group", "eda_07_rate_by_glucose.png")
    make_rate_chart(summary, cleaned_df, "active_label", "Cardiovascular disease rate by physical activity", "Physically active", "eda_08_rate_by_activity.png")


def make_feature_effects_chart():
    feature_effects = pd.read_csv(FEATURE_EFFECTS)
    feature_effects = feature_effects.loc[feature_effects["importance_mean"] > 0].head(10)
    feature_effects = feature_effects.iloc[::-1]

    fig, ax = plt.subplots(figsize=(10.6, 5.6), dpi=160)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")

    ax.barh(
        feature_effects["feature_label"],
        feature_effects["importance_mean"],
        xerr=feature_effects["importance_std"],
        color="#0F766E",
        edgecolor="none",
        height=0.54,
        error_kw={"ecolor": "#94a3b8", "elinewidth": 1.0, "alpha": 0.65, "capsize": 3},
    )

    ax.set_title("Strongest model inputs", fontsize=16, fontweight="bold", pad=12)
    ax.set_xlabel("Mean reduction in model score when shuffled", fontsize=11)
    ax.set_ylabel("")
    ax.grid(axis="x", color="#9ca3af", linewidth=0.6, alpha=0.12)
    ax.grid(axis="y", visible=False)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#111827")
    ax.spines["bottom"].set_color("#111827")
    ax.tick_params(axis="both", labelsize=10, colors="#111827")

    for value, label in zip(feature_effects["importance_mean"], feature_effects["feature_label"]):
        ax.text(value + 0.002, label, f"{value:.3f}", va="center", ha="left", fontsize=9, color="#334155")

    ax.set_xlim(0, feature_effects["importance_mean"].max() * 1.22)
    fig.tight_layout()
    fig.savefig(CHARTS_DIR / "model_06_feature_effects.png", bbox_inches="tight")
    plt.close(fig)


def main():
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)
    make_architecture_diagram()
    make_target_distribution_chart()
    make_eda_charts()
    make_feature_effects_chart()


if __name__ == "__main__":
    main()

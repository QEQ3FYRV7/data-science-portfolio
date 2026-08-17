window.CARDIO_MODEL_SPEC = {
  "project": "Cardiovascular Disease Risk Explorer",
  "modelFamily": "Binary logistic regression",
  "selectedCandidate": "clinical_bands",
  "threshold": 0.35,
  "positiveClass": "cardio = 1, cardiovascular disease present",
  "datasetSummary": {
    "cleanedRows": 68650,
    "overallDiseaseRate": 0.4947,
    "inputRanges": {
      "age_years": {
        "min": 29.56,
        "median": 53.94,
        "max": 64.92
      },
      "height_cm": {
        "min": 100.0,
        "median": 165.0,
        "max": 250.0
      },
      "weight_kg": {
        "min": 28.0,
        "median": 72.0,
        "max": 200.0
      },
      "bmi": {
        "min": 9.92,
        "median": 26.35,
        "max": 152.55
      },
      "ap_hi": {
        "min": 60.0,
        "median": 120.0,
        "max": 240.0
      },
      "ap_lo": {
        "min": 30.0,
        "median": 80.0,
        "max": 182.0
      }
    }
  },
  "numericFeatures": [
    "age_years",
    "bmi",
    "ap_hi",
    "ap_lo",
    "pulse_pressure",
    "mean_arterial_pressure"
  ],
  "categoricalFeatures": [
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
    "active"
  ],
  "numeric": {
    "age_years": {
      "median": 53.9356605065,
      "mean": 53.2986025096,
      "scale": 6.7549130183
    },
    "bmi": {
      "median": 26.3656030287,
      "mean": 27.4869942713,
      "scale": 5.3314475646
    },
    "ap_hi": {
      "median": 120.0,
      "mean": 126.6963219228,
      "scale": 16.6624707824
    },
    "ap_lo": {
      "median": 80.0,
      "mean": 81.3181900947,
      "scale": 9.4678689851
    },
    "pulse_pressure": {
      "median": 40.0,
      "mean": 45.3781318281,
      "scale": 11.660009982
    },
    "mean_arterial_pressure": {
      "median": 93.3333333333,
      "mean": 96.4442340374,
      "scale": 11.0496123154
    }
  },
  "categorical": {
    "gender": [
      1,
      2
    ],
    "age_band": [
      "40-49",
      "50-59",
      "60+",
      "Under 40"
    ],
    "age_decade": [
      "40-44",
      "45-49",
      "50-54",
      "55-59",
      "60+",
      "<40"
    ],
    "bmi_category": [
      "Healthy weight",
      "Obesity",
      "Overweight",
      "Severe obesity",
      "Underweight"
    ],
    "systolic_bp_category": [
      "120-129",
      "130-139",
      "140-159",
      "160+",
      "<120"
    ],
    "diastolic_bp_category": [
      "100-109",
      "110+",
      "80-89",
      "90-99",
      "<80"
    ],
    "pulse_pressure_band": [
      "40-59",
      "60-79",
      "80+",
      "<40"
    ],
    "cholesterol": [
      1,
      2,
      3
    ],
    "gluc": [
      1,
      2,
      3
    ],
    "smoke": [
      0,
      1
    ],
    "alco": [
      0,
      1
    ],
    "active": [
      0,
      1
    ]
  },
  "intercept": 0.1073106174,
  "coefficients": [
    0.4049873633,
    0.1743756028,
    0.0706005688,
    0.0445511964,
    0.0647147838,
    0.0609369704,
    0.0363169224,
    0.0532712807,
    0.110407366,
    -0.0421694433,
    0.0055477641,
    0.0158025163,
    0.0260914248,
    0.0843159412,
    -0.0030187005,
    -0.0391507427,
    0.0055477641,
    0.0158025163,
    0.1206083728,
    0.0890093849,
    0.142411694,
    -0.2147059575,
    -0.0477352911,
    -0.5529631935,
    -0.0063219301,
    0.8140380089,
    0.5024365179,
    -0.6676012001,
    0.2122424098,
    0.1128109079,
    -0.123094193,
    0.1827178926,
    -0.2950888142,
    -0.0748478104,
    0.1617746909,
    0.2829361294,
    -0.2802748068,
    -0.442205856,
    -0.0773594294,
    0.6091534886,
    0.1348558614,
    0.1448546103,
    -0.1901222686,
    0.1213528315,
    -0.0317646284,
    0.1462951657,
    -0.0567069626,
    0.1631696897,
    -0.0735814866
  ],
  "transformedFeatureNames": [
    "numeric__age_years",
    "numeric__bmi",
    "numeric__ap_hi",
    "numeric__ap_lo",
    "numeric__pulse_pressure",
    "numeric__mean_arterial_pressure",
    "categorical__gender_1",
    "categorical__gender_2",
    "categorical__age_band_40-49",
    "categorical__age_band_50-59",
    "categorical__age_band_60+",
    "categorical__age_band_Under 40",
    "categorical__age_decade_40-44",
    "categorical__age_decade_45-49",
    "categorical__age_decade_50-54",
    "categorical__age_decade_55-59",
    "categorical__age_decade_60+",
    "categorical__age_decade_<40",
    "categorical__bmi_category_Healthy weight",
    "categorical__bmi_category_Obesity",
    "categorical__bmi_category_Overweight",
    "categorical__bmi_category_Severe obesity",
    "categorical__bmi_category_Underweight",
    "categorical__systolic_bp_category_120-129",
    "categorical__systolic_bp_category_130-139",
    "categorical__systolic_bp_category_140-159",
    "categorical__systolic_bp_category_160+",
    "categorical__systolic_bp_category_<120",
    "categorical__diastolic_bp_category_100-109",
    "categorical__diastolic_bp_category_110+",
    "categorical__diastolic_bp_category_80-89",
    "categorical__diastolic_bp_category_90-99",
    "categorical__diastolic_bp_category_<80",
    "categorical__pulse_pressure_band_40-59",
    "categorical__pulse_pressure_band_60-79",
    "categorical__pulse_pressure_band_80+",
    "categorical__pulse_pressure_band_<40",
    "categorical__cholesterol_1",
    "categorical__cholesterol_2",
    "categorical__cholesterol_3",
    "categorical__gluc_1",
    "categorical__gluc_2",
    "categorical__gluc_3",
    "categorical__smoke_0",
    "categorical__smoke_1",
    "categorical__alco_0",
    "categorical__alco_1",
    "categorical__active_0",
    "categorical__active_1"
  ],
  "testMetrics": {
    "accuracy": 0.7047,
    "precision": 0.6641,
    "recall": 0.816,
    "f1": 0.7322,
    "rocAuc": 0.7948,
    "averagePrecision": 0.7783,
    "brierScore": 0.1843,
    "trueNegative": 4133,
    "falsePositive": 2804,
    "falseNegative": 1250,
    "truePositive": 5543,
    "testRecords": 13730
  },
  "edaRates": [
    {
      "feature": "age_band",
      "group": "Under 40",
      "records": 1861,
      "rate": 0.2359
    },
    {
      "feature": "age_band",
      "group": "40-49",
      "records": 19431,
      "rate": 0.3751
    },
    {
      "feature": "age_band",
      "group": "50-59",
      "records": 34851,
      "rate": 0.5134
    },
    {
      "feature": "age_band",
      "group": "60+",
      "records": 12507,
      "rate": 0.6671
    },
    {
      "feature": "systolic_bp_category",
      "group": "<120",
      "records": 12727,
      "rate": 0.2306
    },
    {
      "feature": "systolic_bp_category",
      "group": "120-129",
      "records": 28236,
      "rate": 0.356
    },
    {
      "feature": "systolic_bp_category",
      "group": "130-139",
      "records": 9215,
      "rate": 0.5986
    },
    {
      "feature": "systolic_bp_category",
      "group": "140-159",
      "records": 13994,
      "rate": 0.8293
    },
    {
      "feature": "systolic_bp_category",
      "group": "160+",
      "records": 4478,
      "rate": 0.8613
    },
    {
      "feature": "diastolic_bp_category",
      "group": "<80",
      "records": 14016,
      "rate": 0.2835
    },
    {
      "feature": "diastolic_bp_category",
      "group": "80-89",
      "records": 35325,
      "rate": 0.4271
    },
    {
      "feature": "diastolic_bp_category",
      "group": "90-99",
      "records": 14555,
      "rate": 0.7497
    },
    {
      "feature": "diastolic_bp_category",
      "group": "100-109",
      "records": 4127,
      "rate": 0.8381
    },
    {
      "feature": "diastolic_bp_category",
      "group": "110+",
      "records": 627,
      "rate": 0.8469
    },
    {
      "feature": "bmi_category",
      "group": "Underweight",
      "records": 639,
      "rate": 0.2739
    },
    {
      "feature": "bmi_category",
      "group": "Healthy weight",
      "records": 25425,
      "rate": 0.3979
    },
    {
      "feature": "bmi_category",
      "group": "Overweight",
      "records": 24628,
      "rate": 0.5055
    },
    {
      "feature": "bmi_category",
      "group": "Obesity",
      "records": 16171,
      "rate": 0.6183
    },
    {
      "feature": "bmi_category",
      "group": "Severe obesity",
      "records": 1787,
      "rate": 0.6855
    },
    {
      "feature": "cholesterol_label",
      "group": "Above normal",
      "records": 9302,
      "rate": 0.5963
    },
    {
      "feature": "cholesterol_label",
      "group": "Normal",
      "records": 51480,
      "rate": 0.4355
    },
    {
      "feature": "cholesterol_label",
      "group": "Well above normal",
      "records": 7868,
      "rate": 0.7626
    },
    {
      "feature": "glucose_label",
      "group": "Above normal",
      "records": 5067,
      "rate": 0.5887
    },
    {
      "feature": "glucose_label",
      "group": "Normal",
      "records": 58367,
      "rate": 0.4756
    },
    {
      "feature": "glucose_label",
      "group": "Well above normal",
      "records": 5216,
      "rate": 0.6175
    },
    {
      "feature": "active_label",
      "group": "No",
      "records": 13499,
      "rate": 0.5328
    },
    {
      "feature": "active_label",
      "group": "Yes",
      "records": 55151,
      "rate": 0.4854
    }
  ],
  "featureEffects": [
    {
      "feature": "systolic_bp_category",
      "importance_mean": 0.0746424981358907,
      "importance_std": 0.0022408220009174,
      "feature_label": "Systolic BP category"
    },
    {
      "feature": "age_years",
      "importance_mean": 0.0423485339157123,
      "importance_std": 0.0006148410006355,
      "feature_label": "Age"
    },
    {
      "feature": "cholesterol",
      "importance_mean": 0.0214288250200151,
      "importance_std": 0.0018193861659098,
      "feature_label": "Cholesterol"
    },
    {
      "feature": "diastolic_bp_category",
      "importance_mean": 0.0055868423262412,
      "importance_std": 0.0003980008166348,
      "feature_label": "Diastolic BP category"
    },
    {
      "feature": "bmi",
      "importance_mean": 0.0048282113202329,
      "importance_std": 0.0001312660304089,
      "feature_label": "BMI"
    },
    {
      "feature": "active",
      "importance_mean": 0.0023256924356813,
      "importance_std": 0.0003425995598119,
      "feature_label": "Physical activity"
    },
    {
      "feature": "pulse_pressure_band",
      "importance_mean": 0.0020665750327955,
      "importance_std": 0.0002756694638076,
      "feature_label": "Pulse pressure band"
    },
    {
      "feature": "gluc",
      "importance_mean": 0.0014490384862895,
      "importance_std": 0.000355454091479,
      "feature_label": "Glucose"
    },
    {
      "feature": "ap_hi",
      "importance_mean": 0.0007521713210316,
      "importance_std": 0.0001823097111998,
      "feature_label": "Systolic BP"
    },
    {
      "feature": "pulse_pressure",
      "importance_mean": 0.0006472035622658,
      "importance_std": 0.0002007850850347,
      "feature_label": "Pulse pressure"
    },
    {
      "feature": "bmi_category",
      "importance_mean": 0.0006345558216414,
      "importance_std": 0.0002059780551046,
      "feature_label": "BMI category"
    },
    {
      "feature": "mean_arterial_pressure",
      "importance_mean": 0.0006052325867509,
      "importance_std": 0.0001222207285827,
      "feature_label": "Mean arterial pressure"
    },
    {
      "feature": "alco",
      "importance_mean": 0.000553347140733,
      "importance_std": 0.0001777216793318,
      "feature_label": "Alcohol intake"
    },
    {
      "feature": "smoke",
      "importance_mean": 0.0005011391348873,
      "importance_std": 0.0001263137483699,
      "feature_label": "Smoking"
    },
    {
      "feature": "ap_lo",
      "importance_mean": 0.0003634612630369,
      "importance_std": 8.830624272735287e-05,
      "feature_label": "Diastolic BP"
    },
    {
      "feature": "age_band",
      "importance_mean": 0.0003521568143278,
      "importance_std": 0.0001260209140934,
      "feature_label": "Age band"
    },
    {
      "feature": "gender",
      "importance_mean": 7.264599073737443e-05,
      "importance_std": 4.439363308544503e-05,
      "feature_label": "Gender code"
    },
    {
      "feature": "age_decade",
      "importance_mean": -0.0002094601662061,
      "importance_std": 9.509434754877052e-05,
      "feature_label": "Age decade"
    }
  ]
};

# Data Science Portfolio and Project Code

This repository contains the public portfolio website and the public cardiovascular disease
prediction project code.

The portfolio is a static website built with HTML, CSS and JavaScript. It includes a public project
page and an interactive cardiovascular risk-awareness checker prototype. The checker is for learning
and communication only. It is not a medical or diagnostic tool.

## Repository Contents

| Path | Purpose |
| --- | --- |
| `index.html` | Portfolio homepage |
| `styles.css` and `script.js` | Shared portfolio styling and behaviour |
| `assets/` | Images and project visuals used by the website |
| `projects/cardiovascular-disease-prediction/` | Public project page |
| `projects/cardiovascular-risk-checker/` | Published checker prototype |
| `project_1_cardiovascular_disease/` | Project 1 README, notebooks, scripts, charts and local app source |

## Public Project

The public project predicts recorded cardiovascular disease status using routine health indicators
from a Kaggle dataset. The workflow includes data inspection, cleaning, feature engineering,
exploratory analysis, logistic regression modelling, evaluation and responsible communication through
a prototype checker.

The selected model achieved 81.6% recall and 0.795 ROC-AUC on the held-out test set. Recall was
prioritised because the use case is risk awareness, where missing a positive record is more serious
than creating an extra flag for review.

## Data Access

The raw Kaggle dataset is not included in this repository. To run the notebooks, download the dataset
from Kaggle and place it at:

```text
project_1_cardiovascular_disease/01_data/raw/cardio_data.csv
```

Dataset source:

```text
https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset
```

Processed CSV files and generated table CSV files are also excluded because they can be recreated
from the notebooks once the dataset is available locally.

## Run the Website Locally

From the repository root, run:

```bash
python3 -m http.server 8791
```

Then open:

```text
http://127.0.0.1:8791/
```

## Run the Project Workflow

Install the main Python packages:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
```

Then run the notebooks in order:

| Order | Notebook |
| ---: | --- |
| 1 | `project_1_cardiovascular_disease/02_notebooks/01_dataset_read_only_inspection.ipynb` |
| 2 | `project_1_cardiovascular_disease/02_notebooks/02_data_cleaning_and_eda.ipynb` |
| 3 | `project_1_cardiovascular_disease/02_notebooks/03_logistic_regression_model.ipynb` |

The project details, metrics, limitations and key sources are documented in:

```text
project_1_cardiovascular_disease/README.md
```

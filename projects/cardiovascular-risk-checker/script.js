(() => {
  const spec = window.CARDIO_MODEL_SPEC;

  if (!spec) {
    document.body.innerHTML = "<main class=\"page-shell\"><p>Model specification could not be loaded.</p></main>";
    return;
  }

  const threshold = spec.threshold;
  const overallRate = spec.datasetSummary.overallDiseaseRate;
  const sourceGenderDefault = 2;
  const lifestyleAdjustments = {
    smoke: 0.04,
    alcohol: 0.02,
  };

  const controls = {
    age: document.getElementById("age"),
    height: document.getElementById("height"),
    weight: document.getElementById("weight"),
    systolic: document.getElementById("systolic"),
    diastolic: document.getElementById("diastolic"),
    cholesterol: document.getElementById("cholesterol"),
    glucose: document.getElementById("glucose"),
    smoke: document.getElementById("smoke"),
    alcohol: document.getElementById("alcohol"),
    active: document.getElementById("active"),
  };

  const outputs = {
    age: document.getElementById("age-output"),
    height: document.getElementById("height-output"),
    weight: document.getElementById("weight-output"),
    systolic: document.getElementById("systolic-output"),
    diastolic: document.getElementById("diastolic-output"),
  };

  const elements = {
    form: document.getElementById("risk-form"),
    formMessage: document.getElementById("form-message"),
    outcomeTitle: document.getElementById("outcome-title"),
    statusPill: document.getElementById("status-pill"),
    riskGauge: document.getElementById("risk-gauge"),
    riskPercent: document.getElementById("risk-percent"),
    resultCopy: document.getElementById("result-copy"),
    bmiValue: document.getElementById("bmi-value"),
    bpBandValue: document.getElementById("bp-band-value"),
    pulseValue: document.getElementById("pulse-value"),
    copyButton: document.getElementById("copy-button"),
    medicalChart: document.getElementById("medical-chart"),
    medicalDetail: document.getElementById("medical-detail"),
    factorTabs: document.getElementById("factor-tabs"),
    groupChart: document.getElementById("group-chart"),
    groupDetail: document.getElementById("group-detail"),
    signalChart: document.getElementById("signal-chart"),
    signalDetail: document.getElementById("signal-detail"),
    profileChart: document.getElementById("profile-chart"),
    profileDetail: document.getElementById("profile-detail"),
    modal: document.getElementById("chart-modal"),
    modalTitle: document.getElementById("modal-title"),
    modalClose: document.getElementById("modal-close"),
  };

  const defaultProfile = {
    age: 54,
    height: 165,
    weight: 72,
    systolic: 120,
    diastolic: 80,
    cholesterol: 1,
    glucose: 1,
    smoke: false,
    alcohol: false,
    active: true,
  };

  const presets = {
    balanced: {
      age: 48,
      height: 170,
      weight: 68,
      systolic: 116,
      diastolic: 76,
      cholesterol: 1,
      glucose: 1,
      smoke: false,
      alcohol: false,
      active: true,
    },
    "raised-bp": {
      age: 59,
      height: 164,
      weight: 86,
      systolic: 152,
      diastolic: 96,
      cholesterol: 2,
      glucose: 2,
      smoke: false,
      alcohol: false,
      active: false,
    },
    reset: defaultProfile,
  };

  const factorConfig = {
    age_band: {
      label: "Age",
      order: ["Under 40", "40-49", "50-59", "60+"],
    },
    systolic_bp_category: {
      label: "Systolic BP",
      order: ["<120", "120-129", "130-139", "140-159", "160+"],
    },
    diastolic_bp_category: {
      label: "Diastolic BP",
      order: ["<80", "80-89", "90-99", "100-109", "110+"],
    },
    bmi_category: {
      label: "BMI",
      order: ["Underweight", "Healthy weight", "Overweight", "Obesity", "Severe obesity"],
    },
    cholesterol_label: {
      label: "Cholesterol",
      order: ["Normal", "Above normal", "Well above normal"],
    },
    glucose_label: {
      label: "Glucose",
      order: ["Normal", "Above normal", "Well above normal"],
    },
    active_label: {
      label: "Activity",
      order: ["Yes", "No"],
    },
  };

  let selectedFactor = "systolic_bp_category";
  let latestResult = null;
  let activeExplorer = "medical";

  const explorerTitles = {
    medical: "Health range comparison",
    groups: "Similar dataset groups",
    signals: "Risk signal breakdown",
    profile: "Risk factor summary",
  };

  function toNumber(value) {
    return Number.parseFloat(value);
  }

  function sigmoid(value) {
    return 1 / (1 + Math.exp(-value));
  }

  function pct(value, digits = 0) {
    return `${(value * 100).toFixed(digits)}%`;
  }

  function pointText(value) {
    const sign = value >= 0 ? "+" : "-";
    return `${sign}${Math.abs(value * 100).toFixed(1)} percentage points`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cholesterolLabel(value) {
    return {
      1: "Normal",
      2: "Above normal",
      3: "Well above normal",
    }[Number(value)];
  }

  function glucoseLabel(value) {
    return cholesterolLabel(value);
  }

  function yesNoLabel(value) {
    return Number(value) === 1 ? "Yes" : "No";
  }

  function ageBand(age) {
    if (age < 40) return "Under 40";
    if (age < 50) return "40-49";
    if (age < 60) return "50-59";
    return "60+";
  }

  function ageDecade(age) {
    if (age < 40) return "<40";
    if (age < 45) return "40-44";
    if (age < 50) return "45-49";
    if (age < 55) return "50-54";
    if (age < 60) return "55-59";
    return "60+";
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy weight";
    if (bmi < 30) return "Overweight";
    if (bmi < 40) return "Obesity";
    return "Severe obesity";
  }

  function systolicCategory(value) {
    if (value < 120) return "<120";
    if (value < 130) return "120-129";
    if (value < 140) return "130-139";
    if (value < 160) return "140-159";
    return "160+";
  }

  function diastolicCategory(value) {
    if (value < 80) return "<80";
    if (value < 90) return "80-89";
    if (value < 100) return "90-99";
    if (value < 110) return "100-109";
    return "110+";
  }

  function pulsePressureBand(value) {
    if (value < 40) return "<40";
    if (value < 60) return "40-59";
    if (value < 80) return "60-79";
    return "80+";
  }

  function readInputs() {
    return {
      age: toNumber(controls.age.value),
      height: toNumber(controls.height.value),
      weight: toNumber(controls.weight.value),
      systolic: toNumber(controls.systolic.value),
      diastolic: toNumber(controls.diastolic.value),
      gender: sourceGenderDefault,
      cholesterol: Number(controls.cholesterol.value),
      glucose: Number(controls.glucose.value),
      smoke: controls.smoke.checked ? 1 : 0,
      alcohol: controls.alcohol.checked ? 1 : 0,
      active: controls.active.checked ? 1 : 0,
    };
  }

  function derivedFeatures(raw) {
    const bmi = raw.weight / ((raw.height / 100) ** 2);
    const pulsePressure = raw.systolic - raw.diastolic;
    const meanArterialPressure = raw.diastolic + pulsePressure / 3;

    return {
      age_years: raw.age,
      height_cm: raw.height,
      weight_kg: raw.weight,
      bmi,
      ap_hi: raw.systolic,
      ap_lo: raw.diastolic,
      pulse_pressure: pulsePressure,
      mean_arterial_pressure: meanArterialPressure,
      gender: raw.gender,
      cholesterol: raw.cholesterol,
      gluc: raw.glucose,
      smoke: raw.smoke,
      alco: raw.alcohol,
      active: raw.active,
      age_band: ageBand(raw.age),
      age_decade: ageDecade(raw.age),
      bmi_category: bmiCategory(bmi),
      systolic_bp_category: systolicCategory(raw.systolic),
      diastolic_bp_category: diastolicCategory(raw.diastolic),
      pulse_pressure_band: pulsePressureBand(pulsePressure),
      cholesterol_label: cholesterolLabel(raw.cholesterol),
      glucose_label: glucoseLabel(raw.glucose),
      active_label: yesNoLabel(raw.active),
    };
  }

  function validationMessages(raw, derived) {
    const messages = [];
    if (raw.systolic <= raw.diastolic) {
      messages.push("Systolic blood pressure should be higher than diastolic blood pressure.");
    }
    if (derived.pulse_pressure < 15) {
      messages.push("Pulse pressure is very low for this project dataset. Please check the blood pressure values.");
    }
    return messages;
  }

  function transformedVector(features) {
    const vector = [];

    spec.numericFeatures.forEach((feature) => {
      const rule = spec.numeric[feature];
      const value = Number.isFinite(features[feature]) ? features[feature] : rule.median;
      vector.push((value - rule.mean) / rule.scale);
    });

    spec.categoricalFeatures.forEach((feature) => {
      const value = features[feature];
      spec.categorical[feature].forEach((category) => {
        vector.push(String(value) === String(category) ? 1 : 0);
      });
    });

    return vector;
  }

  function predict(features) {
    const vector = transformedVector(features);
    const score = vector.reduce(
      (total, value, index) => total + value * spec.coefficients[index],
      spec.intercept,
    );

    return sigmoid(score);
  }

  function lifestyleAdjustment(raw) {
    return (
      (raw.smoke ? lifestyleAdjustments.smoke : 0)
      + (raw.alcohol ? lifestyleAdjustments.alcohol : 0)
    );
  }

  function checkerProbability(raw, features) {
    const neutralLifestyleFeatures = {
      ...features,
      smoke: 0,
      alco: 0,
    };
    const neutralModelProbability = predict(neutralLifestyleFeatures);
    return Math.min(0.98, neutralModelProbability + lifestyleAdjustment(raw));
  }

  function riskState(probability) {
    if (probability >= 0.6) {
      return {
        level: "high",
        title: "Higher risk estimate",
        pill: "Above review point",
        gauge: "#e35d4f",
        message:
          "This profile is clearly above the review point used in the prototype. If these were real health details, the result should be discussed with a qualified health professional.",
      };
    }

    if (probability >= threshold) {
      return {
        level: "medium",
        title: "Review point reached",
        pill: "Above review point",
        gauge: "#d59a1f",
        message:
          "This profile is above the review point used in the prototype. The threshold is set low because the project prioritises not missing possible risk signals.",
      };
    }

    return {
      level: "low",
      title: "Not flagged by this checker",
      pill: "Below review point",
      gauge: "#00b894",
      message:
        "This profile is below the review point used in the prototype. That does not mean no health risk exists, but the checker does not flag this profile.",
    };
  }

  function lookupRate(feature, group) {
    return spec.edaRates.find((row) => row.feature === feature && row.group === group);
  }

  function groupRows(feature) {
    const config = factorConfig[feature];
    const rows = spec.edaRates.filter((row) => row.feature === feature);
    return config.order
      .map((group) => rows.find((row) => row.group === group))
      .filter(Boolean);
  }

  function comparisonRows(features) {
    return [
      { feature: "age_band", group: features.age_band },
      { feature: "systolic_bp_category", group: features.systolic_bp_category },
      { feature: "diastolic_bp_category", group: features.diastolic_bp_category },
      { feature: "bmi_category", group: features.bmi_category },
      { feature: "cholesterol_label", group: features.cholesterol_label },
      { feature: "glucose_label", group: features.glucose_label },
      { feature: "active_label", group: features.active_label },
    ]
      .map((item) => {
        const rateRow = lookupRate(item.feature, item.group);
        return {
          ...item,
          label: factorConfig[item.feature].label,
          rate: rateRow ? rateRow.rate : null,
          records: rateRow ? rateRow.records : null,
          difference: rateRow ? rateRow.rate - overallRate : null,
        };
      })
      .filter((item) => item.rate !== null);
  }

  function lifestyleSignalRows(raw) {
    const rows = [];
    if (raw.smoke) {
      rows.push({
        feature: "smoke",
        group: "Selected",
        label: "Smoking",
        rate: overallRate + lifestyleAdjustments.smoke,
        records: null,
        difference: lifestyleAdjustments.smoke,
        note: "The checker treats smoking as a risk-increasing lifestyle factor.",
      });
    }
    if (raw.alcohol) {
      rows.push({
        feature: "alcohol",
        group: "Recorded",
        label: "Alcohol intake",
        rate: overallRate + lifestyleAdjustments.alcohol,
        records: null,
        difference: lifestyleAdjustments.alcohol,
        note: "The checker treats recorded alcohol intake as a modest risk-increasing lifestyle factor.",
      });
    }
    return rows;
  }

  function rangePercent(value, min, max) {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }

  function medicalRows(features) {
    return [
      {
        key: "bmi",
        label: "BMI",
        value: features.bmi,
        display: features.bmi.toFixed(1),
        band: features.bmi_category,
        min: 15,
        max: 45,
        segments: [
          { width: 12, className: "watch" },
          { width: 22, className: "ok" },
          { width: 17, className: "watch" },
          { width: 34, className: "alert" },
          { width: 15, className: "alert" },
        ],
        detail: "BMI is calculated from height and weight. In the project data, higher BMI groups had higher observed cardiovascular disease rates.",
      },
      {
        key: "systolic",
        label: "Systolic BP",
        value: features.ap_hi,
        display: `${Math.round(features.ap_hi)} mmHg`,
        band: features.systolic_bp_category,
        min: 90,
        max: 180,
        segments: [
          { width: 33, className: "ok" },
          { width: 11, className: "watch" },
          { width: 11, className: "watch" },
          { width: 22, className: "alert" },
          { width: 23, className: "alert" },
        ],
        detail: "Systolic blood pressure was one of the strongest signals in the project model and EDA charts.",
      },
      {
        key: "diastolic",
        label: "Diastolic BP",
        value: features.ap_lo,
        display: `${Math.round(features.ap_lo)} mmHg`,
        band: features.diastolic_bp_category,
        min: 55,
        max: 120,
        segments: [
          { width: 38, className: "ok" },
          { width: 15, className: "watch" },
          { width: 15, className: "alert" },
          { width: 15, className: "alert" },
          { width: 17, className: "alert" },
        ],
        detail: "Diastolic blood pressure also showed a clear increase across higher bands in the project data.",
      },
      {
        key: "pulse",
        label: "Pulse pressure",
        value: features.pulse_pressure,
        display: `${Math.round(features.pulse_pressure)} mmHg`,
        band: features.pulse_pressure_band,
        min: 20,
        max: 90,
        segments: [
          { width: 29, className: "ok" },
          { width: 29, className: "watch" },
          { width: 28, className: "alert" },
          { width: 14, className: "alert" },
        ],
        detail: "Pulse pressure is the gap between systolic and diastolic blood pressure. The project uses it as an extra blood pressure signal.",
      },
    ];
  }

  function renderGauge(probability, state) {
    elements.riskGauge.style.setProperty("--angle", `${probability * 360}deg`);
    elements.riskGauge.style.setProperty("--gauge-color", state.gauge);
    elements.riskPercent.textContent = pct(probability);
  }

  function renderResult(probability, features) {
    const state = riskState(probability);

    elements.outcomeTitle.textContent = state.title;
    elements.statusPill.textContent = state.pill;
    elements.statusPill.className = `status-pill ${state.level === "low" ? "low" : ""} ${state.level === "high" ? "high" : ""}`;
    elements.resultCopy.textContent = state.message;
    renderGauge(probability, state);

    elements.bmiValue.textContent = features.bmi.toFixed(1);
    elements.bpBandValue.textContent = `${features.systolic_bp_category} / ${features.diastolic_bp_category}`;
    elements.pulseValue.textContent = `${Math.round(features.pulse_pressure)} mmHg`;
  }

  function renderInputIssue(message, features) {
    elements.outcomeTitle.textContent = "Check input values";
    elements.statusPill.textContent = "Input check";
    elements.statusPill.className = "status-pill high";
    elements.riskGauge.style.setProperty("--angle", "0deg");
    elements.riskGauge.style.setProperty("--gauge-color", "#e35d4f");
    elements.riskPercent.textContent = "--";
    elements.resultCopy.textContent = message;
    elements.bmiValue.textContent = Number.isFinite(features.bmi) ? features.bmi.toFixed(1) : "--";
    elements.bpBandValue.textContent = "--";
    elements.pulseValue.textContent = "--";
  }

  function renderMedicalChart(features) {
    const rows = medicalRows(features);
    elements.medicalChart.innerHTML = "";

    rows.forEach((row, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `medical-row chart-button ${index === 0 ? "is-selected" : ""}`;
      button.innerHTML = `
        <span class="row-label">${escapeHtml(row.label)}<small>${escapeHtml(row.band)}</small></span>
        <span class="range-track">
          <span class="range-segments">
            ${row.segments.map((segment) => `<span class="${segment.className}" style="width:${segment.width}%"></span>`).join("")}
          </span>
          <span class="range-marker" style="left:${rangePercent(row.value, row.min, row.max)}%"></span>
        </span>
        <strong class="row-value">${escapeHtml(row.display)}</strong>
      `;
      button.addEventListener("click", () => {
        document.querySelectorAll(".medical-row").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        renderMedicalDetail(row);
      });
      elements.medicalChart.appendChild(button);
    });

    renderMedicalDetail(rows[0]);
  }

  function renderMedicalDetail(row) {
    elements.medicalDetail.innerHTML = `
      <h3>${escapeHtml(row.label)}: ${escapeHtml(row.band)}</h3>
      <p><strong>Your value is ${escapeHtml(row.display)}.</strong> ${escapeHtml(row.detail)}</p>
    `;
  }

  function renderFactorTabs() {
    elements.factorTabs.innerHTML = "";
    Object.entries(factorConfig).forEach(([feature, config]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tab-button ${feature === selectedFactor ? "is-active" : ""}`;
      button.textContent = config.label;
      button.addEventListener("click", () => {
        selectedFactor = feature;
        renderFactorTabs();
        if (latestResult) renderGroupChart(latestResult.features);
      });
      elements.factorTabs.appendChild(button);
    });
  }

  function renderGroupChart(features) {
    const rows = groupRows(selectedFactor);
    const selectedGroup = features[selectedFactor];
    elements.groupChart.innerHTML = "";

    rows.forEach((row) => {
      const isSelected = String(row.group) === String(selectedGroup);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `group-row chart-button ${isSelected ? "is-selected" : ""}`;
      button.innerHTML = `
        <span class="row-label">${escapeHtml(row.group)}<small>${row.records.toLocaleString("en-GB")} records</small></span>
        <span class="bar-track">
          <span class="bar-fill" style="width:${Math.round(row.rate * 100)}%"></span>
          <span class="overall-marker" style="left:${Math.round(overallRate * 100)}%"></span>
        </span>
        <strong class="row-value">${pct(row.rate, 1)}</strong>
      `;
      button.addEventListener("click", () => {
        document.querySelectorAll(".group-row").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        renderGroupDetail(row, factorConfig[selectedFactor].label, isSelected);
      });
      elements.groupChart.appendChild(button);
      if (isSelected) renderGroupDetail(row, factorConfig[selectedFactor].label, true);
    });
  }

  function renderGroupDetail(row, label, isCurrent) {
    const relation = row.rate >= overallRate ? "above" : "below";
    elements.groupDetail.innerHTML = `
      <h3>${escapeHtml(label)}: ${escapeHtml(row.group)}</h3>
      <p><strong>${pct(row.rate, 1)}</strong> of records in this group had cardiovascular disease in the cleaned project dataset. That is ${pointText(row.rate - overallRate)} ${relation} the dataset average. ${isCurrent ? "This is the group your current input falls into." : "This is a comparison group."}</p>
    `;
  }

  function renderSignalChart(rows) {
    const sorted = [...rows].sort((left, right) => Math.abs(right.difference) - Math.abs(left.difference));
    elements.signalChart.innerHTML = "";

    sorted.forEach((row, index) => {
      const width = Math.min(100, Math.abs(row.difference) * 180);
      const isPositive = row.difference >= 0;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `signal-row chart-button ${index === 0 ? "is-selected" : ""}`;
      button.innerHTML = `
        <span class="row-label">${escapeHtml(row.label)}<small>${escapeHtml(row.group)}</small></span>
        <span class="signal-track">
          <span class="signal-fill ${isPositive ? "" : "negative"}" style="grid-column:${isPositive ? 2 : 1}; width:${width}%"></span>
        </span>
        <strong class="row-value">${pointText(row.difference)}</strong>
      `;
      button.addEventListener("click", () => {
        document.querySelectorAll(".signal-row").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        renderSignalDetail(row);
      });
      elements.signalChart.appendChild(button);
    });

    renderSignalDetail(sorted[0]);
  }

  function renderSignalDetail(row) {
    if (row.note) {
      elements.signalDetail.innerHTML = `
        <h3>${escapeHtml(row.label)}: ${escapeHtml(row.group)}</h3>
        <p><strong>${pointText(row.difference)}</strong> added to the displayed checker result. ${escapeHtml(row.note)} This is used to avoid presenting the dataset artefact as health advice.</p>
      `;
      return;
    }

    const relation = row.difference >= 0 ? "higher" : "lower";
    elements.signalDetail.innerHTML = `
      <h3>${escapeHtml(row.label)}: ${escapeHtml(row.group)}</h3>
      <p>In this matched group, <strong>${pct(row.rate, 1)}</strong> of records had cardiovascular disease. That is ${pointText(row.rate - overallRate)} ${relation} than the cleaned dataset average, so it helps explain why the checker moves the result up or down.</p>
    `;
  }

  function profileStatus(status) {
    return {
      lower: { label: "Lower-risk", width: 34, className: "lower" },
      watch: { label: "Watch", width: 67, className: "watch" },
      higher: { label: "Higher-risk", width: 100, className: "higher" },
    }[status];
  }

  function profileRows(raw, features) {
    return [
      {
        label: "Age",
        value: `${Math.round(raw.age)} years`,
        status: raw.age >= 60 ? "higher" : raw.age >= 50 ? "watch" : "lower",
        detail: "Age is included because observed cardiovascular disease rates were higher in older age bands in the project dataset.",
      },
      {
        label: "Systolic blood pressure",
        value: `${Math.round(raw.systolic)} mmHg`,
        status: raw.systolic >= 140 ? "higher" : raw.systolic >= 120 ? "watch" : "lower",
        detail: "Systolic blood pressure is one of the strongest signals in the model and the exploratory analysis.",
      },
      {
        label: "Diastolic blood pressure",
        value: `${Math.round(raw.diastolic)} mmHg`,
        status: raw.diastolic >= 90 ? "higher" : raw.diastolic >= 80 ? "watch" : "lower",
        detail: "Higher diastolic blood pressure bands had higher observed cardiovascular disease rates in the cleaned data.",
      },
      {
        label: "BMI",
        value: features.bmi.toFixed(1),
        status: features.bmi >= 30 ? "higher" : features.bmi >= 25 || features.bmi < 18.5 ? "watch" : "lower",
        detail: "BMI is calculated from height and weight. Higher BMI groups had higher cardiovascular disease percentages in the project data.",
      },
      {
        label: "Cholesterol",
        value: features.cholesterol_label,
        status: raw.cholesterol === 3 ? "higher" : raw.cholesterol === 2 ? "watch" : "lower",
        detail: "The cleaned data showed higher disease rates for above-normal and well-above-normal cholesterol groups.",
      },
      {
        label: "Glucose",
        value: features.glucose_label,
        status: raw.glucose === 3 ? "higher" : raw.glucose === 2 ? "watch" : "lower",
        detail: "Glucose is included as a routine health indicator and is treated as a watch signal when above normal.",
      },
      {
        label: "Smoking",
        value: raw.smoke ? "Selected" : "Not selected",
        status: raw.smoke ? "higher" : "lower",
        detail: "The checker treats smoking as a risk-increasing lifestyle factor for the user-facing result.",
      },
      {
        label: "Alcohol intake",
        value: raw.alcohol ? "Recorded" : "Not recorded",
        status: raw.alcohol ? "watch" : "lower",
        detail: "Recorded alcohol intake is treated as a watch signal in the user-facing checker.",
      },
      {
        label: "Physical activity",
        value: raw.active ? "Active" : "Not active",
        status: raw.active ? "lower" : "watch",
        detail: "Physical activity is treated as a lower-risk signal. Not active is shown as a watch signal.",
      },
    ];
  }

  function renderProfileChart(raw, features) {
    const rows = profileRows(raw, features);
    elements.profileChart.innerHTML = "";

    rows.forEach((row, index) => {
      const status = profileStatus(row.status);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `profile-row chart-button ${index === 0 ? "is-selected" : ""}`;
      button.innerHTML = `
        <span class="row-label">${escapeHtml(row.label)}<small>${escapeHtml(row.value)}</small></span>
        <span class="profile-track">
          <span class="profile-fill ${status.className}" style="width:${status.width}%"></span>
        </span>
        <strong class="row-value">${escapeHtml(status.label)}</strong>
      `;
      button.addEventListener("click", () => {
        document.querySelectorAll(".profile-row").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        renderProfileDetail(row);
      });
      elements.profileChart.appendChild(button);
    });

    renderProfileDetail(rows[0]);
  }

  function renderProfileDetail(row) {
    const status = profileStatus(row.status);
    elements.profileDetail.innerHTML = `
      <h3>${escapeHtml(row.label)}: ${escapeHtml(status.label)}</h3>
      <p><strong>Your value is ${escapeHtml(row.value)}.</strong> ${escapeHtml(row.detail)}</p>
    `;
  }

  function syncOutputs(raw) {
    outputs.age.textContent = Math.round(raw.age);
    outputs.height.textContent = Math.round(raw.height);
    outputs.weight.textContent = Math.round(raw.weight);
    outputs.systolic.textContent = Math.round(raw.systolic);
    outputs.diastolic.textContent = Math.round(raw.diastolic);
  }

  function clearCharts() {
    [
      elements.medicalChart,
      elements.groupChart,
      elements.signalChart,
      elements.profileChart,
    ].forEach((element) => {
      element.innerHTML = "";
    });
    [
      elements.medicalDetail,
      elements.groupDetail,
      elements.signalDetail,
      elements.profileDetail,
    ].forEach((element) => {
      element.innerHTML = "<p>Enter valid values to see this explanation.</p>";
    });
  }

  function showExplorerPane(type) {
    activeExplorer = type;
    elements.modalTitle.textContent = explorerTitles[type];

    document.querySelectorAll(".modal-pane").forEach((pane) => {
      pane.hidden = pane.dataset.pane !== type;
    });
  }

  function openExplorer(type) {
    if (!latestResult) {
      updateResult();
    }

    showExplorerPane(type);
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
    elements.modalClose.focus();
  }

  function closeExplorer() {
    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function updateResult({ announce = false } = {}) {
    const raw = readInputs();
    const features = derivedFeatures(raw);
    const messages = validationMessages(raw, features);

    syncOutputs(raw);

    if (messages.length > 0) {
      latestResult = null;
      elements.formMessage.textContent = messages[0];
      elements.formMessage.className = "form-message is-warning";
      renderInputIssue(messages[0], features);
      clearCharts();
      return null;
    }

    const probability = checkerProbability(raw, features);
    const rows = comparisonRows(features);
    const signalRows = rows.concat(lifestyleSignalRows(raw));

    latestResult = { raw, features, probability, rows, signalRows };
    elements.formMessage.textContent = announce ? "Risk estimate updated." : "";
    elements.formMessage.className = "form-message";

    renderResult(probability, features);
    renderMedicalChart(features);
    renderGroupChart(features);
    renderSignalChart(signalRows);
    renderProfileChart(raw, features);

    return latestResult;
  }

  function setProfile(profile, announce = true) {
    controls.age.value = profile.age;
    controls.height.value = profile.height;
    controls.weight.value = profile.weight;
    controls.systolic.value = profile.systolic;
    controls.diastolic.value = profile.diastolic;
    controls.cholesterol.value = String(profile.cholesterol);
    controls.glucose.value = String(profile.glucose);
    controls.smoke.checked = Boolean(profile.smoke);
    controls.alcohol.checked = Boolean(profile.alcohol);
    controls.active.checked = Boolean(profile.active);
    updateResult({ announce });
  }

  function resultSummary() {
    const result = updateResult();
    if (!result) return "The current input values need checking before a result can be summarised.";

    const state = riskState(result.probability);
    return [
      "Cardiovascular Risk Checker summary",
      `Risk estimate: ${pct(result.probability, 1)}`,
      `Result: ${state.title}`,
      `BMI: ${result.features.bmi.toFixed(1)}`,
      `Blood pressure band: ${result.features.systolic_bp_category} / ${result.features.diastolic_bp_category}`,
      `Smoking selected: ${result.raw.smoke ? "Yes" : "No"}`,
      `Alcohol intake recorded: ${result.raw.alcohol ? "Yes" : "No"}`,
      "This is a portfolio demonstration and not medical advice.",
    ].join("\n");
  }

  async function copySummary() {
    const text = resultSummary();
    try {
      await navigator.clipboard.writeText(text);
      elements.formMessage.textContent = "Summary copied.";
      elements.formMessage.className = "form-message";
    } catch {
      elements.formMessage.textContent = text;
      elements.formMessage.className = "form-message";
    }
  }

  function addButtonRipples() {
    document.querySelectorAll(".action-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);

        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;

        button.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 560);
      });
    });
  }

  Object.values(controls).forEach((control) => {
    control.addEventListener("input", () => updateResult());
    control.addEventListener("change", () => updateResult());
  });

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      setProfile(presets[button.dataset.preset]);
    });
  });

  document.querySelectorAll("[data-explore]").forEach((button) => {
    button.addEventListener("click", () => {
      openExplorer(button.dataset.explore);
    });
  });

  elements.modalClose.addEventListener("click", closeExplorer);

  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeExplorer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hidden) {
      closeExplorer();
    }
  });

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateResult({ announce: true });
  });

  elements.copyButton.addEventListener("click", copySummary);

  renderFactorTabs();
  addButtonRipples();
  setProfile(defaultProfile, false);
})();

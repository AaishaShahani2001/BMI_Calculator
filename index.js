// Utility: clear active highlights
function clearHighlights() {
  document
    .querySelectorAll(".range-card .chip.active")
    .forEach((el) => el.classList.remove("active"));
}

// Show/hide cards based on selected gender + toggle
function updateCardVisibility() {
  const maleChecked = document.getElementById("m-sex").checked;
  const femaleChecked = document.getElementById("f-sex").checked;
  const showBoth = document.getElementById("show-both").checked;

  const maleCard = document.getElementById("male-card");
  const femaleCard = document.getElementById("female-card");

  // Default: if no gender selected, show both
  if (!maleChecked && !femaleChecked) {
    maleCard.classList.remove("hidden");
    femaleCard.classList.remove("hidden");
    return;
  }

  if (showBoth) {
    maleCard.classList.remove("hidden");
    femaleCard.classList.remove("hidden");
  } else {
    if (maleChecked) {
      maleCard.classList.remove("hidden");
      femaleCard.classList.add("hidden");
    } else if (femaleChecked) {
      femaleCard.classList.remove("hidden");
      maleCard.classList.add("hidden");
    }
  }
}

function highlightRangeFor(gender, bmi) {
  clearHighlights();
  const cardId = gender === "male" ? "#male-card" : "#female-card";
  document.querySelectorAll(`${cardId} .chip`).forEach((chip) => {
    const min = parseFloat(chip.getAttribute("data-min"));
    const max = parseFloat(chip.getAttribute("data-max"));
    if (bmi >= min && bmi <= max) chip.classList.add("active");
  });
}

function calculateBMI() {
  // Read inputs
  const ageRaw = document.getElementById("age").value.trim();
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const male = document.getElementById("m-sex").checked;
  const female = document.getElementById("f-sex").checked;

  // Validations
  if (!ageRaw || isNaN(ageRaw) || ageRaw < 0 || ageRaw > 120) {
    alert("Please enter a valid age between 0 and 120.");
    return;
  }
  if (!height || isNaN(height) || height < 50 || height > 300) {
    alert("Please enter a valid height between 50 cm and 300 cm.");
    return;
  }
  if (!weight || isNaN(weight) || weight < 5 || weight > 500) {
    alert("Please enter a valid weight between 5 kg and 500 kg.");
    return;
  }
  if (!male && !female) {
    alert("Please select your gender.");
    return;
  }

  // Compute BMI
  const h = height / 100; // meters
  const bmi = +(weight / (h * h)).toFixed(2);

  // Show number
  document.getElementById("result").textContent = bmi.toFixed(2);

  // Choose gender ranges & highlight
  const gender = male ? "male" : "female";
  highlightRangeFor(gender, bmi);

  // Ensure visibility respects toggle
  updateCardVisibility();

  // Comment area
  const comment = document.getElementById("comment");
  comment.style.display = "block";

  let msg = "";
  let color = "";

  if (gender === "male") {
    if (bmi < 18.5) {
      msg = "You are underweight. Include healthy & nutritious foods.";
      color = "#f39c12";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      msg = "You are healthy. Good! Maintain it.";
      color = "#2ecc71";
    } else if (bmi >= 24.9 && bmi < 30) {
      msg = "You are overweight. Make a diet plan and exercise regularly.";
      color = "rgba(246, 200, 18, 1)";
    } else {
      msg = "You are obese. Consult a doctor.";
      color = "#e74c3c";
    }
  } else {
    if (bmi < 18.0) {
      msg = "You are underweight. Include healthy & nutritious foods.";
      color = "#f39c12";
    } else if (bmi >= 18.0 && bmi < 24.0) {
      msg = "You are healthy. Good! Maintain it.";
      color = "#2ecc71";
    } else if (bmi >= 24.0 && bmi < 29.0) {
      msg = "You are overweight. Make a diet plan and exercise regularly.";
      color = "rgba(246, 200, 18, 1)";
    } else {
      msg = "You are obese. Consult a doctor.";
      color = "#e74c3c";
    }
  }

  comment.textContent = msg;
  comment.style.color = color;
}

// Respond to UI changes
document.getElementById("m-sex").addEventListener("change", () => {
  clearHighlights();
  updateCardVisibility();
});
document.getElementById("f-sex").addEventListener("change", () => {
  clearHighlights();
  updateCardVisibility();
});
document.getElementById("show-both").addEventListener("change", updateCardVisibility);

// On first load: show both cards
updateCardVisibility();

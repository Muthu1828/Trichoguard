def predict_lifestyle(age, gender, water, diet ,sleep,smoking, alcohol, stress,activity,genetics):

    score = (
        diet +
        (3 - water) +
        smoking +
        alcohol +
        stress +
        (3 - activity) +
        genetics
    )

    if age > 40:
        score += 1

    if score <= 6:
        severity = "Low"
    elif score <= 12:
        severity = "Moderate"
    else:
        severity = "High"

    return {"severity": severity}
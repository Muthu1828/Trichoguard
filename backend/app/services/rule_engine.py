def generate_explanation(final_severity, diet, stress, sleep):

    cause = ""
    prevention = ""

    if stress >= 2:
        cause += "High stress levels affecting hair health. "

    if sleep <= 1:
        cause += "Poor sleep cycle contributing to hair fall. "

    if diet <= 1:
        cause += "Poor nutrition weakening hair roots. "

    if final_severity == "High":
        prevention = "Reduce stress, improve diet, and maintain proper sleep schedule."
    elif final_severity == "Moderate":
        prevention = "Maintain balanced diet and control stress levels."
    else:
        prevention = "Continue healthy lifestyle to prevent future hair fall."

    return cause, prevention
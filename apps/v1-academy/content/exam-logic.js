function gradeExam(answers) {
    const correctAnswers = ['A', 'C', 'B', 'D'];
    let score = 0;
    
    answers.forEach((ans, index) => {
        if (ans === correctAnswers[index]) score += 25;
    });

    if (score >= 80) {
        return { passed: true, score: score, message: "Certificate Issued! Badge Unlocked." };
    } else {
        return { passed: false, score: score, message: "Please retake the module." };
    }
}

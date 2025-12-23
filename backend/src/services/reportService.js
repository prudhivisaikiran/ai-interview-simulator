import PDFDocument from 'pdfkit';

const generateHeader = (doc, user, session) => {
    doc
        .fontSize(20)
        .text('AI Interview Report', { align: 'center' })
        .moveDown();

    doc.fontSize(12).text(`Candidate: ${user.name}`);
    doc.text(`Role: ${session.role.toUpperCase()}`);
    doc.text(`Difficulty: ${session.difficulty}`);
    doc.text(`Mode: ${session.mode}`);
    doc.text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`);

    if (session.overallScore) {
        doc.moveDown().fontSize(14).text(`Overall Score: ${session.overallScore}%`, { align: 'right' });
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
};

const generateAverageScores = (doc, turns) => {
    let totalCorrectness = 0, totalClarity = 0, totalConfidence = 0;
    let count = 0;

    turns.forEach((turn) => {
        if (turn.type === 'feedback' && turn.meta?.scores) {
            totalCorrectness += turn.meta.scores.correctness || 0;
            totalClarity += turn.meta.scores.clarity || 0;
            totalConfidence += turn.meta.scores.confidence || 0;
            count++;
        }
    });

    if (count === 0) return;

    const avgCorrectness = (totalCorrectness / count).toFixed(1);
    const avgClarity = (totalClarity / count).toFixed(1);
    const avgConfidence = (totalConfidence / count).toFixed(1);

    doc.fontSize(16).text('Performance Metrics', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Average Correctness: ${avgCorrectness}/10`);
    doc.text(`Average Clarity: ${avgClarity}/10`);
    doc.text(`Average Confidence: ${avgConfidence}/10`);
    doc.moveDown();
};

const generateSkillsSection = (doc, assessment) => {
    if (!assessment) return;

    doc.fontSize(16).text('Skill Assessment', { underline: true });
    doc.moveDown();

    // Radar Table
    if (assessment.radar && assessment.radar.labels.length > 0) {
        doc.fontSize(14).text('Skill Radar');
        doc.fontSize(12);
        assessment.radar.labels.forEach((label, i) => {
            doc.text(`${label}: ${assessment.radar.values[i]}%`);
        });
        doc.moveDown();
    }

    // Weakest Skills
    const weakSkills = assessment.skills
        .filter(s => s.score < 60)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);

    if (weakSkills.length > 0) {
        doc.fontSize(14).text('Areas for Improvement', { underline: true });
        weakSkills.forEach(skill => {
            doc.fontSize(12).font('Helvetica-Bold').text(`${skill.name} (${skill.score}%)`);
            doc.font('Helvetica').text(`Gap: ${skill.notes || 'Needs practice'}`);
            doc.moveDown(0.5);
        });
        doc.moveDown();
    }
};

const generateRecommendations = (doc, recommendations) => {
    if (!recommendations) return;

    doc.fontSize(16).text('Personalized Learning Plan', { underline: true });
    doc.moveDown();

    if (recommendations.quickFix && recommendations.quickFix.length > 0) {
        doc.fontSize(14).text('Quick Fixes (1-2 Days)');
        doc.fontSize(10);
        recommendations.quickFix.forEach(rec => doc.text(`• ${rec}`));
        doc.moveDown();
    }

    if (recommendations.buildStrength && recommendations.buildStrength.length > 0) {
        doc.fontSize(14).text('Build Strength (1-2 Weeks)');
        doc.fontSize(10);
        recommendations.buildStrength.forEach(rec => doc.text(`• ${rec}`));
        doc.moveDown();
    }

    if (recommendations.interviewReady && recommendations.interviewReady.length > 0) {
        doc.fontSize(14).text('Interview Ready (1 Month)');
        doc.fontSize(10);
        recommendations.interviewReady.forEach(rec => doc.text(`• ${rec}`));
        doc.moveDown();
    }
};

const generateTranscript = (doc, turns) => {
    doc.addPage();
    doc.fontSize(18).text('Interview Transcript', { align: 'center' });
    doc.moveDown();

    // Group by question
    // Assumes strictly ordered: Question -> Answer -> Feedback
    let currentQ = null;

    turns.forEach(turn => {
        if (turn.type === 'question') {
            currentQ = turn;
            doc.moveDown();
            doc.fontSize(12).font('Helvetica-Bold').fillColor('black').text(`Q: ${turn.content}`);
        } else if (turn.type === 'answer') {
            doc.fontSize(11).font('Helvetica').fillColor('#333333').text(`A: ${turn.content}`);
        } else if (turn.type === 'feedback') {
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica-Oblique').fillColor('#555555').text(`Feedback: ${turn.content}`);
            if (turn.meta?.scores) {
                const { correctness, clarity, confidence } = turn.meta.scores;
                doc.text(`[Corr: ${correctness} | Clar: ${clarity} | Conf: ${confidence}]`);
            }
            doc.moveDown();
            doc.moveTo(50, doc.y).strokeColor('#aaaaaa').lineTo(550, doc.y).stroke();
        }
    });
};

export const generatePDFReport = (session, user, turns, assessment, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream to response
    doc.pipe(res);

    // Content
    generateHeader(doc, user, session);
    generateAverageScores(doc, turns);
    generateSkillsSection(doc, assessment);
    generateRecommendations(doc, assessment?.recommendations);
    generateTranscript(doc, turns);

    doc.end();
};

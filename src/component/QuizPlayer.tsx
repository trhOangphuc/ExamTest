import type { Quiz } from "../data/type";
import { useQuiz } from "../hook/useQuiz";
import { quizData } from "../data/quiz";
import { useMemo, useEffect, useState } from "react";

export const QuizPlayer: React.FC = () => {
    const quiz: Quiz = quizData;
    const { current, goNext, goPrev, jumpTo, answers, setAnswers, timeLeft, submit, submitted, score } = useQuiz(quiz);
    const question = useMemo(() => quiz.questions[current], [quiz, current]);

    // 🚩 state flag review later
    const [flagged, setFlagged] = useState<{ [id: string]: boolean }>({});

    // ✅ Khôi phục tiến độ từ localStorage khi load
    useEffect(() => {
        const saved = localStorage.getItem("quizProgress");
        if (saved) {
            const { savedAnswers, savedCurrent, savedFlags } = JSON.parse(saved);
            if (savedAnswers) setAnswers(savedAnswers);
            if (savedCurrent) jumpTo(savedCurrent);
            if (savedFlags) setFlagged(savedFlags);
        }
    }, []);

    // ✅ Tự động lưu tiến độ mỗi khi answers, current, flagged thay đổi
    useEffect(() => {
        localStorage.setItem("quizProgress", JSON.stringify({
            savedAnswers: answers,
            savedCurrent: current,
            savedFlags: flagged,
        }));
    }, [answers, current, flagged]);

    const notAnswered = useMemo(
        () => quiz.questions.filter(q => !answers[q.id] || answers[q.id] === ""),
        [quiz.questions, answers]
    );

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "Enter" && question.type !== "short") submit();
    };

    const handleChange = (value: string) => {
        if (question.type === "boolean") {
            setAnswers(prev => ({ ...prev, [question.id]: value as "true" | "false" }));
        } else {
            setAnswers(prev => ({ ...prev, [question.id]: value }));
        }
    };

    const handleSubmit = () => {
        if (notAnswered.length > 0) {
            const index = quiz.questions.findIndex(q => q.id === notAnswered[0].id);
            jumpTo(index);
            alert("You have not completed the test !");
            return;
        }
        submit();
    };

    const toggleFlag = (id: string) => {
        setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (submitted) {
        return (
            <>
                <h1>Result: {score} / {quiz.questions.length}</h1>
                {quiz.questions.map(q => {
                    const userAnswer = answers[q.id];
                    const isCorrect = q.correctAnswers.includes(userAnswer);

                    return (
                        <div className="result" key={q.id}>
                            <p style={{ fontWeight: "bold" }}> Content: {q.content}</p>

                            <p
                                className="yourAnswer"
                                style={{ fontWeight: "normal", color: isCorrect ? "green" : "red" }}
                            >
                                ---Your answer: {userAnswer}
                                {isCorrect ? (
                                    <span style={{ marginLeft: "8px", color: "green" }}>✔️</span>
                                ) : (
                                    <span style={{ marginLeft: "8px", color: "red" }}>❌</span>
                                )}
                            </p>

                            <p className="correct" style={{ fontWeight: "normal", color: "green" }}>
                                ---Correct answer: {q.correctAnswers.join(", ")}
                            </p>

                            {q.explanation && (
                                <p className="explanation" style={{ fontWeight: "normal" }}>
                                    ---Explanation: {q.explanation}
                                </p>
                            )}
                        </div>
                    );
                })}
            </>
        );
    }

    return (
        <div className="main" tabIndex={0} onKeyDown={handleKey}>
            <div className="time">
                {quiz.durationMinutes && <div className="timeItem" style={{ fontWeight: "bold" }}>Time: {timeLeft}</div>}
            </div>
            <div className="body">
                <h1 className="title">My Exam thp: {quiz.title}</h1>
                <div className="answerQuestion">
                    <p className="content" style={{ fontWeight: "bolder" }}>{question.content}</p>
                    <p className="descroption" style={{ fontWeight: "lighter" }} >*{quiz.description}</p>

                    {question.type === "single" && question.choices.map(c => (
                        <label className="groupAnswer" key={c}>
                            <input
                                type="radio"
                                name={question.id}
                                value={c}
                                checked={answers[question.id] === c}
                                onChange={() => { goNext(); handleChange(c) }}
                            />
                            <span>{c}</span>
                        </label>
                    ))}

                    {question.type === "boolean" && ["true", "false"].map(c => (
                        <label key={c}>
                            <input
                                type="radio"
                                name={question.id}
                                value={c}
                                checked={answers[question.id] === c}
                                onChange={() => { goNext(); handleChange(c) }}
                            />
                            {c}
                        </label>
                    ))}

                    {question.type === "short" && (
                        <input
                            type="text"
                            value={answers[question.id] || ""}
                            onChange={e => handleChange(e.target.value)}
                        />
                    )}
                </div>

                <button
                    onClick={() => toggleFlag(question.id)}
                    style={{
                        marginTop: "12px",
                        background: flagged[question.id] ? "#ffcccc" : "#ddd",
                        border: "1px solid #999",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {flagged[question.id] ? "🚩 Unflag" : "🚩 Flag for review"}
                </button>
            </div >

            <button
                className="myButton"
                onClick={handleSubmit}
                style={{
                    padding: "12px 24px",
                    backgroundColor: "#71df95",
                    color: "#000000ff",
                    border: "2px solid #079e3aff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginTop: "16px",
                    width: "150px",
                    alignSelf: "center"
                }}
            >
                Submit
            </button>

            <div className="groupButton">
                <div className="ClickButton">
                    <div className="ButtonPrevNext">
                        <button className="Buttonprev" onClick={goPrev} disabled={current === 0}>{`←`}</button>
                        <button className="Buttonnext" onClick={goNext} disabled={current === quiz.questions.length - 1}>{`→`}</button>
                    </div>
                </div>
                <div className="page">
                    {quiz.questions.map((_, i) => (
                        <button
                            className="pageItem"
                            key={i}
                            onClick={() => jumpTo(i)}
                            style={{
                                fontWeight: current === i ? "bold" : "normal",
                                color: flagged[quiz.questions[i].id] ? "red" : "black"
                            }}
                        >
                            <div className="pageFlag">
                                <div>{i + 1}</div>
                                <div>{flagged[quiz.questions[i].id] ? "🚩" : ""}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div >
    );
};

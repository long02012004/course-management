import { useEffect, useState } from "react";
import Select from "react-select";
import "./QuizQA.scss";
import { LuBadgePlus } from "react-icons/lu";
import { LuBadgeMinus } from "react-icons/lu";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import Lightbox from "react-awesome-lightbox";
import {
  getAllQuizForAdmin,
  postCreateNewQuestionForQuiz,
  postCreateNewAnswerForQuiz,
  getQuizWithQA,
  postUpsertQA,
} from "../../../../services/ApiServices";
import { toast } from "react-toastify";

const QuizQA = () => {
  const [listQuiz, setListQuiz] = useState([]);
  useEffect(() => {
    fetchQuiz();
  }, []);
  const [selectedQuiz, setSelectQuiz] = useState({});

  useEffect(() => {
    if (selectedQuiz && selectedQuiz.value) {
      fetchQuizWithQA();
    }
  }, [selectedQuiz]);

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }
  const fetchQuizWithQA = async () => {
    let res = await getQuizWithQA(selectedQuiz.value);

    if (res && res.data.EC === 0) {
      let newQA = [];
      for (let i = 0; i < res.data.DT.qa.length; i++) {
        let q = res.data.DT.qa[i];
        if (q.imageFile) {
          q.imageName = `Question-${q.id}.png`;
          q.imageFile = await urltoFile(
            `data:image/png;base64,${q.imageFile}`,
            `Question-${q.id}.png`,
            "image/png"
          );
        }
        newQA.push(q);
      }
      setQuestions(newQA);
    }
  };
  const fetchQuiz = async () => {
    let res = await getAllQuizForAdmin();
    if (res.data && res.data.EC === 0) {
      let newQuiz = res.data.DT.map((item) => {
        return {
          value: item.id,
          label: `${item.id} - ${item.description}`,
        };
      });
      setListQuiz(newQuiz);
    }
  };
  const initQuestion = [
    {
      id: uuidv4(),
      description: "",
      imageFile: "",
      imageName: "",
      answers: [
        {
          id: uuidv4(),
          description: "",
          isCorrect: false,
        },
      ],
    },
  ];

  const [questions, setQuestions] = useState(initQuestion);

  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [dataImagePreview, setDataImagePreview] = useState({
    title: "",
    url: "",
  });
  const handleAddRemoveQuestion = (type, id) => {
    if (type === "ADD") {
      const newQuestion = {
        id: uuidv4(),
        description: "",
        imageFile: "",
        imageName: "",
        answers: [
          {
            id: uuidv4(),
            description: "",
            isCorrect: false,
          },
        ],
      };
      setQuestions([...questions, newQuestion]);
    }
    /*   if (type === "REMOVE") {
      let questionClone = questions;
      questionClone.filter((item) => item.id !== id);
      setQuestions(questionClone);
    } */
    if (type === "REMOVE") {
      let questionClone = questions.filter((item) => item.id !== id);
      setQuestions(questionClone);
    }
  };
  const handleAddRemoveAnswer = (type, questionId, answerId) => {
    let questionClone = _.cloneDeep(questions);
    if (type === "ADD") {
      const newAnswer = {
        id: uuidv4(),
        description: "",
        isCorrect: false,
      };
      let index = questionClone.findIndex((item) => item.id === questionId);
      questionClone[index].answers.push(newAnswer);
      setQuestions(questionClone);
    }

    if (type === "REMOVE") {
      let index = questionClone.findIndex((item) => item.id === questionId);
      questionClone[index].answers = questionClone[index].answers.filter(
        (item) => item.id !== answerId
      );
      setQuestions(questionClone);
    }
  };

  const handleOnchange = (type, questionId, value) => {
    if (type === "QUESTION") {
      let questionClone = _.cloneDeep(questions);
      let index = questionClone.findIndex((item) => item.id === questionId);
      if (index > -1) {
        questionClone[index].description = value;
        setQuestions(questionClone);
      }
    }
  };

  const handleOnChangeFileQuestion = (questionId, e) => {
    let questionClone = _.cloneDeep(questions);
    let index = questionClone.findIndex((item) => item.id === questionId);
    if (index > -1 && e.target && e.target.files && e.target.files[0]) {
      questionClone[index].imageFile = e.target.files[0];
      questionClone[index].imageName = e.target.files[0].name;
      setQuestions(questionClone);
    }
  };
  const handleAnswerQuestion = (type, answerId, questionId, value) => {
    let questionClone = _.cloneDeep(questions);
    let index = questionClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionClone[index].answers = questionClone[index].answers.map(
        (answer) => {
          if (answer.id === answerId) {
            if (type === "CHECKBOX") {
              answer.isCorrect = value;
            }
            if (type === "INPUT") {
              answer.description = value;
            }
          }
          return answer;
        }
      );
      setQuestions(questionClone);
    }
  };
  const handleSubmitQuestionForQuiz = async () => {
    //validate
    // todo
    if (_.isEmpty(selectedQuiz)) {
      toast.error("please choose a Quiz");
      return;
    }

    //validate answer
    let isValidAnswer = true;
    let indexQ = 0;
    let indexA = 0;
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (!questions[i].answers[j].description) {
          isValidAnswer = false;
          indexA = j;
          break;
        }
        indexQ = i;
        if (isValidAnswer === false) break;
      }
      if (isValidAnswer === false) {
        toast.error(`Not empty Answer ${indexA + 1} at Question ${indexQ + 1}`);
        return;
      }

      // validate question
      let isValidQuestion = true;
      let indexQ1 = 0;
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].description) {
          isValidQuestion = false;
          indexQ1 = i;
          break;
        }
      }
      if (isValidQuestion === false) {
        toast.error(`Not empty description for Question ${indexQ1 + 1}`);
        return;
      }
    }
    // cách 1
    /*   //submit questions
    await Promise.all(
      questions.map(async (question) => {
        const q = await postCreateNewQuestionForQuiz(
          +selectedQuiz.value,
          question.description,
          question.imageFile
        );
        //submit answer
        await Promise.all(
          question.answers.map(async (answer) => {
            await postCreateNewAnswerForQuiz(
              answer.description,
              answer.isCorrect,
              q.data.DT.id
            );
          })
        );
      })
    ); */
    // Cách 2
    //submit questions
    /*  for (const question of questions) {
      const q = await postCreateNewQuestionForQuiz(
        +selectedQuiz.value,
        question.description,
        question.imageFile
      );
      for (const answer of question.answers) {
        await postCreateNewAnswerForQuiz(
          answer.description,
          answer.isCorrect,
          q.data.DT.id
        );
      }
    } */
    //cách 3
    let questionClone = _.cloneDeep(questions);
    for (let i = 0; i < questionClone.length; i++) {
      questionClone[i].imageFile = await toBase64(questionClone[i].imageFile);
    }
    let res = await postUpsertQA({
      quizId: selectedQuiz.value,
      questions: questionClone,
    });
    console.log("check res postUpsertQA: ", res);
    if (res.data && res.data.EC === 0) {
      toast.success(res.data.EM);
      fetchQuizWithQA();
    }
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  const handlePreviewImage = (questionId) => {
    let questionClone = _.cloneDeep(questions);
    let index = questionClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      setDataImagePreview({
        url: URL.createObjectURL(questionClone[index].imageFile),
        title: questionClone[index].imageName,
      });
      setIsPreviewImage(true);
    }
  };
  return (
    <>
      <div className="questions-container">
        <div className="add-new-question">
          <div className="col-6 form-group">
            <label className="mb-2">Select Quiz:</label>
            <Select
              defaultValue={selectedQuiz}
              onChange={setSelectQuiz}
              options={listQuiz}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          </div>
          <div className="mt-3 mb-2">Add-questions:</div>
          {questions &&
            questions.length > 0 &&
            questions.map((question, index) => {
              return (
                <div key={question.id} className="q-main mb-5">
                  <div className="questions-content">
                    <div className="form-floating description">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="name@example.com"
                        value={question.description}
                        onChange={(e) =>
                          handleOnchange(
                            "QUESTION",
                            question.id,
                            e.target.value
                          )
                        }
                      />
                      <label> Question {index + 1} Description</label>
                    </div>
                    <div className="group-upload">
                      <label htmlFor={`${question.id}`}>
                        <LuImagePlus className="label-upload" />
                      </label>
                      <input
                        id={`${question.id}`}
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleOnChangeFileQuestion(question.id, e)
                        }
                      />
                      <span>
                        {question.imageName ? (
                          <span
                            style={{ cursor: "pointer", color: "#01bab9" }}
                            onClick={() => handlePreviewImage(question.id)}
                          >
                            {question.imageName}
                          </span>
                        ) : (
                          "0 file is uploaded"
                        )}
                      </span>
                    </div>
                    <div className="btn-add">
                      <span>
                        <LuBadgePlus
                          className="icon-add"
                          onClick={() => handleAddRemoveQuestion("ADD", "")}
                        />
                      </span>
                      {questions.length > 1 && (
                        <span>
                          <LuBadgeMinus
                            className="icon-remove"
                            onClick={() =>
                              handleAddRemoveQuestion("REMOVE", question.id)
                            }
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  {question.answers &&
                    question.answers.length > 0 &&
                    question.answers.map((answer, index) => {
                      return (
                        <div key={answer.id} className="answers-content">
                          <input
                            className="form-check-input is-correct"
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              handleAnswerQuestion(
                                "CHECKBOX",
                                answer.id,
                                question.id,
                                e.target.checked
                              )
                            }
                          />
                          <div className="form-floating answer-name">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="name@example.com"
                              value={answer.description}
                              onChange={(e) =>
                                handleAnswerQuestion(
                                  "INPUT",
                                  answer.id,
                                  question.id,
                                  e.target.value
                                )
                              }
                            />
                            <label>Answer {index + 1}</label>
                          </div>
                          <div className="btn-group">
                            <span>
                              <CiCirclePlus
                                className="icon-add"
                                onClick={() =>
                                  handleAddRemoveAnswer("ADD", question.id)
                                }
                              />
                            </span>
                            {question.answers.length > 1 && (
                              <span>
                                <CiCircleMinus
                                  className="icon-remove"
                                  onClick={() =>
                                    handleAddRemoveAnswer(
                                      "REMOVE",
                                      question.id,
                                      answer.id
                                    )
                                  }
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          {questions && questions.length > 0 && (
            <div>
              <button
                onClick={() => handleSubmitQuestionForQuiz()}
                className="btn btn-warning"
              >
                Save Question
              </button>
            </div>
          )}
          {isPreviewImage && (
            <Lightbox
              image={dataImagePreview.url}
              title={dataImagePreview.title}
              onClose={() => setIsPreviewImage(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default QuizQA;

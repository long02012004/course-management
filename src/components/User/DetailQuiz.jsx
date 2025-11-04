import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getDataQuiz, postSubmitQuiz } from "../../services/ApiServices";
import "./DetailQuiz.scss";
import _ from "lodash";
import User from "./User";
import Question from "./Question";
import ModalResult from "./ModalResult";
import RightContent from "./Content/RightContent";

const DetailQuiz = () => {
  const params = useParams();
  // 📌 Lấy id bài quiz từ URL (ví dụ: /quiz/1 -> id = 1)
  const location = useLocation(); // 📌 Lấy thông tin truyền từ trang trước (quizTitle,...)
  const quizId = params.id;

  // 📌 State lưu dữ liệu câu hỏi + đáp án
  const [dataQuiz, setDataQuiz] = useState([]);

  // 📌 State lưu vị trí câu hỏi hiện tại (đang ở câu số mấy)
  const [index, setIndex] = useState(0);
  // bật mở modal
  const [isShowModalResult, setIsShowModalResult] = useState(false);
  //quản  lý data modal
  const [dataModalResult, setDataModalResult] = useState({});

  // 📌 Khi quizId thay đổi thì gọi lại API để load câu hỏi mới
  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  // 📌 Hàm gọi API lấy danh sách câu hỏi và định dạng lại dữ liệu
  const fetchQuestions = async () => {
    const res = await getDataQuiz(quizId); // gọi API
    if (res && res.data.EC === 0) {
      // 📌 Nếu gọi API thành công
      let raw = res.data.DT;
      // 📌 Dùng lodash nhóm dữ liệu theo id câu hỏi
      let data = _.chain(raw)
        .groupBy("id") // nhóm tất cả đáp án theo id câu hỏi
        .map((value, key) => {
          let answers = [];
          let questionDescription,
            image = null;

          // 📌 Lấy mô tả và hình ảnh của câu hỏi (chỉ cần dòng đầu tiên)
          value.forEach((item, index) => {
            if (index === 0) {
              (questionDescription = item.description), (image = item.image);
            }
            // 📌 Gắn thêm cờ isSelected để theo dõi đáp án đã chọn
            item.answers.isSelected = false;
            answers.push(item.answers);
          });

          // 📌 Trả về object đã format
          return { questionId: key, answers, questionDescription, image };
        })
        .value();
      setDataQuiz(data); // 📌 Lưu dữ liệu đã xử lý vào state
    }
  };

  // 📌 Nút quay lại câu hỏi trước
  const handlePrev = () => {
    if (index - 1 < 0) return; // nếu đang ở câu đầu thì không làm gì
    setIndex(index - 1); // lùi lại 1 câu
  };

  // 📌 Nút sang câu hỏi kế tiếp
  const handleNext = () => {
    if (dataQuiz && dataQuiz.length > index + 1) setIndex(index + 1);
    else setIndex(0); // nếu hết thì quay lại câu đầu tiên
  };

  // 📌 Xử lý khi người dùng tick/bỏ tick checkbox ở component con
  const handleChechBox = (answerId, questionId) => {
    // 📌 clone sâu mảng dataQuiz để tránh thay đổi trực tiếp state
    let dataQuizClone = _.cloneDeep(dataQuiz);

    // 📌 Tìm câu hỏi tương ứng theo questionId
    let question = dataQuizClone.find(
      (item) => +item.questionId === +questionId
    );

    // 📌 Nếu tìm thấy câu hỏi và có danh sách đáp án
    if (question && question.answers) {
      let b = question.answers.map((item) => {
        if (+item.id === +answerId) {
          // 📌 Đảo ngược trạng thái chọn (true <-> false)
          item.isSelected = !item.isSelected;
        }
        return item;
      });
      question.answers = b;
    }

    // 📌 Cập nhật lại câu hỏi trong danh sách chính
    let index = dataQuizClone.findIndex(
      (item) => +item.questionId === +questionId
    );
    if (index > -1) {
      dataQuizClone[index] = question;
      setDataQuiz(dataQuizClone); // 📌 Cập nhật lại state -> render lại UI
    }
  };
  // 📌 Khi nhấn "Finish" → gom toàn bộ câu trả lời người dùng đã chọn
  const handleFinishQuiz = async () => {
    // 👉 In ra dữ liệu hiện tại của toàn bộ câu hỏi để kiểm tra
    console.log("check data finish", dataQuiz);

    // 👉 Tạo object `payload` chuẩn bị gửi về backend
    //    - quizId: id của bài quiz hiện tại
    //    - answers: mảng chứa danh sách câu trả lời của người dùng
    let payload = {
      quizId: +quizId, // Dấu "+" để chuyển quizId từ string sang number
      answers: [],
    };

    // 👉 Tạo mảng tạm để chứa tất cả các câu hỏi + đáp án đã chọn
    let answers = [];

    // 👉 Kiểm tra xem có dữ liệu quiz không (tránh lỗi khi rỗng)
    if (dataQuiz && dataQuiz.length > 0) {
      // 👉 Lặp qua từng câu hỏi trong bài quiz
      dataQuiz.forEach((question) => {
        let questionId = question.questionId; // Lấy id câu hỏi hiện tại
        let userAnswerId = []; // Mảng chứa id các đáp án người dùng chọn

        // 📌 Duyệt qua toàn bộ đáp án của câu hỏi đó
        question.answers.forEach((a) => {
          // 👉 Nếu đáp án này được người dùng tick chọn
          if (a.isSelected === true) {
            // 👉 Thì thêm id của đáp án đó vào danh sách userAnswerId
            userAnswerId.push(a.id);
          }
        });

        // 📌 Sau khi duyệt xong 1 câu hỏi → tạo object chứa kết quả người dùng
        //    gồm: id câu hỏi & danh sách đáp án được chọn
        answers.push({
          questionId: +questionId, // ép kiểu sang number cho đồng nhất
          userAnswerId: userAnswerId, // mảng id các đáp án được chọn
        });

        // 📌 Cập nhật lại vào payload chính
        //    (ở mỗi vòng lặp, payload.answers được gán lại = toàn bộ answers hiện có)
        payload.answers = answers;

        // 👉 In ra payload tạm thời sau mỗi câu hỏi để kiểm tra
      });
      //submit quiz
      const res = await postSubmitQuiz(payload);
      console.log("check res:", res);
      if (res.data && res.data.EC === 0) {
        setDataModalResult({
          countCorrect: res.data.DT.countCorrect,
          countTotal: res.data.DT.countTotal,
          quizData: res.data.DT.quizData,
        });
        setIsShowModalResult(true);
      } else {
        alert("Something wrongs....   ");
      }
    }
  };

  return (
    <>
      <div className="detail-quiz-container">
        <div className="left-content">
          {/* 📌 Hiển thị tiêu đề quiz */}
          <div className="title">
            Quiz {quizId}: {location?.state?.quizTitle}
          </div>
          <hr />

          <div className="q-body"></div>

          {/* 📌 Truyền dữ liệu và hàm xử lý xuống component con Question */}
          <div className="q-content">
            <Question
              handleChechBox={handleChechBox} // 📌 callback để con gọi ngược lên khi tick
              index={index} // 📌 câu hỏi hiện tại đang hiển thị
              data={dataQuiz && dataQuiz.length > 0 ? dataQuiz[index] : []} // 📌 truyền dữ liệu câu hỏi hiện tại
            />
          </div>

          {/* 📌 Các nút điều hướng câu hỏi */}
          <div className="footer">
            <button className="btn btn-secondary" onClick={() => handlePrev()}>
              Prev
            </button>
            <button className="btn btn-primary" onClick={() => handleNext()}>
              Next
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleFinishQuiz()}
            >
              Finish
            </button>
          </div>
        </div>

        {/* 📌 Cột phải (chưa dùng) */}
        <div className="right-content">
          <RightContent
            dataQuiz={dataQuiz}
            handleFinishQuiz={handleFinishQuiz}
            setIndex={setIndex}
          />
        </div>
        <ModalResult
          show={isShowModalResult}
          setShow={setIsShowModalResult}
          dataModalResult={dataModalResult}
        />
      </div>
    </>
  );
};
export default DetailQuiz;

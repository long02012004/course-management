import _ from "lodash";
import "./DetailQuiz.scss";
import Lightbox from "react-awesome-lightbox";
import { useState } from "react";

// Component Question nhận 3 props từ cha:
// - data: chứa thông tin 1 câu hỏi + danh sách đáp án
// - index: thứ tự câu hỏi (để hiển thị "Question 1, 2,...")
// - handleChechBox: hàm từ cha để xử lý tick chọn đáp án
const Question = ({ data, index, handleChechBox }) => {
  // Nếu data rỗng (chưa load được dữ liệu câu hỏi) → không render gì cả
  if (_.isEmpty(data)) {
    return <></>;
  }

  // Hàm con để xử lý sự kiện click vào checkbox
  // Nhận (event, answerId, questionId)
  // Sau đó gọi lại hàm cha handleChechBox để xử lý logic
  const handleChechBoxChange = (e, aId, qId) => {
    handleChechBox(aId, qId);
  };
  const [isPreviewImage, setIsPreviewImage] = useState(false);

  return (
    <>
      {/* Nếu câu hỏi có ảnh → hiển thị ảnh */}
      {data.image ? (
        <div className="q-image">
          <img
            style={{ cursor: "pointer" }}
            onClick={() => setIsPreviewImage(true)}
            src={`data:image/jpeg;base64,${data.image}`}
            alt={data.questionDescription}
          />
          {isPreviewImage && (
            <Lightbox
              image={`data:image/jpeg;base64,${data.image}`}
              title={"Question Image"}
              onClose={() => setIsPreviewImage(false)}
            />
          )}
        </div>
      ) : (
        // Nếu không có ảnh thì vẫn tạo 1 khung rỗng để bố cục không bị lệch
        <div className="q-image"></div>
      )}

      {/* Hiển thị phần nội dung câu hỏi */}
      <div className="question">
        Question {index + 1}: {data.questionDescription} ?
      </div>

      {/* Danh sách các đáp án */}
      <div className="answer">
        {data.answers &&
          data.answers.length > 0 &&
          data.answers.map((a, index) => {
            return (
              <div key={`answer-${index}`} className="a-child">
                <div className="form-check">
                  {/* Checkbox (bootstrap) cho từng đáp án */}
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={a.isSelected}
                    // Khi người dùng tick vào checkbox
                    // → Gọi hàm handleChechBoxChange
                    // → Gửi id của đáp án (a.id) và id của câu hỏi (data.questionId)
                    onChange={(e) =>
                      handleChechBoxChange(e, a.id, data.questionId)
                    }
                  />
                  {/* Hiển thị mô tả đáp án */}
                  <label className="form-check-label">{a.description}</label>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Question;

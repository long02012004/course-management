import Select from "react-select";
import { useState, useEffect } from "react";
import "./AssignQuiz.scss";
import {
  getAllQuizForAdmin,
  getAllUser,
  postAssignQuiz,
} from "../../../../services/ApiServices";
import { toast } from "react-toastify";
const AssignQuiz = () => {
  const [listQuiz, setListQuiz] = useState([]);
  const [selectedQuiz, setSelectQuiz] = useState({});

  const [listUser, setListUser] = useState([]);
  const [selectedUser, setSelectUser] = useState({});
  useEffect(() => {
    fetchQuiz();
    fetchUser();
  }, []);

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
  const fetchUser = async () => {
    let res = await getAllUser();
    console.log("check User:", res);
    if (res.data && res.data.EC === 0) {
      let newUser = res.data.DT.map((item) => {
        return {
          value: item.id,
          label: `${item.id} - ${item.username} - ${item.email}`,
        };
      });
      setListUser(newUser);
    }
  };
  const handleAssign = async () => {
    let res = await postAssignQuiz(selectedQuiz.value, selectedUser.value);
    if (res && res.data.EC) {
      toast.success(res.data.EM);
    } else {
      toast.error(res.data.EM);
    }
  };
  return (
    <>
      <div className="assign-quiz-container row">
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
        <div className="col-6 form-group">
          <label className="mb-2">Select User:</label>
          <Select
            defaultValue={selectedUser}
            onChange={setSelectUser}
            options={listUser}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
        <div>
          <button
            className="btn btn-warning mt-3"
            onClick={() => handleAssign()}
          >
            Assign
          </button>
        </div>
      </div>
    </>
  );
};
export default AssignQuiz;

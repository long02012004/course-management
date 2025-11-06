import BarChartExample from "./BarChartExample";
import "./dashboard.scss";
import { getOverview } from "../../../services/ApiServices";
import { useState, useEffect } from "react";
const Dashboard = () => {
  const [dataOverView, setDataOverView] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  useEffect(() => {
    fetchDataOverView();
  }, []);
  const fetchDataOverView = async () => {
    let res = await getOverview();
    console.log("check res overview:", res);
    if (res.data && res.data.EC === 0) {
      setDataOverView(res.data.DT);
      let Qz = 0,
        Qs = 0,
        As = 0;
      Qz = res?.data?.DT?.others?.countQuiz ?? 0;
      Qs = res?.data?.DT?.others?.countQuestions ?? 0;
      As = res?.data?.DT?.others?.countAnswers ?? 0;
      const data = [
        {
          name: "Quizzes",
          Qz: Qz,
        },
        {
          name: "Questions",
          Qs: Qs,
        },
        {
          name: "Answers",
          As: As,
        },
      ];
      setDataChart(data);
    }
  };
  console.log("check dataOverView:", dataOverView);
  return (
    <div className="dashboard-container">
      <div className="title">Analytics Dashboard</div>
      <div className="content">
        <div className="content-left">
          <div className="child">
            <span className="text-1">Total users</span>
            <span className="text-2">
              {dataOverView &&
              dataOverView.users &&
              dataOverView.users.total ? (
                <>{dataOverView.users.total}</>
              ) : (
                "0"
              )}
            </span>
          </div>
          <div className="child">
            <span className="text-1">Total quiz</span>
            <span className="text-2">
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countQuiz ? (
                <>{dataOverView.others.countQuiz}</>
              ) : (
                "0"
              )}
            </span>
          </div>
          <div className="child">
            <span className="text-1">Total question</span>
            <span className="text-2">
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countQuestions ? (
                <>{dataOverView.others.countQuestions}</>
              ) : (
                "0"
              )}
            </span>
          </div>
          <div className="child">
            <span className="text-1">Total answers</span>
            <span className="text-2">
              {dataOverView &&
              dataOverView.others &&
              dataOverView.others.countAnswers ? (
                <>{dataOverView.others.countAnswers}</>
              ) : (
                "0"
              )}
            </span>
          </div>
        </div>
        <div className="content-right">
          <BarChartExample dataChart={dataChart} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

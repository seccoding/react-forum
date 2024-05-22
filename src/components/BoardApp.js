import { useEffect, useState } from "react";
import BoardView from "./BoardView";
import WriteBoardForm from "./WriteBoardForm";
import { loadAllBoards } from "../http/http";

export default function BoardApp({ token, myInfo }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState();
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [needReload, setNeedReload] = useState();

  const isSelect = selectedBoardId !== undefined;

  // 게시글 불러오기
  useEffect(() => {
    const loadBoards = async () => {
      if (!token) {
        setBoards([]);
        return;
      }

      const json = await loadAllBoards(token);
      console.log(json);
      setBoards(json.body);
    };
    loadBoards();
  }, [token, needReload]);

  const onRowClickHandler = (rowId) => {
    setSelectedBoardId(rowId);
  };

  const onWriteModeClickHandler = () => {
    setIsWriteMode(true);
  };

  return (
    <>
      {token && !isSelect && !isWriteMode && (
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((boardItem) => (
              <tr
                key={boardItem.id}
                onClick={() => onRowClickHandler(boardItem.id)}
              >
                <td>{boardItem.id}</td>
                <td>{boardItem.subject}</td>
                <td>{boardItem.memberVO.name}</td>
                <td>{boardItem.viewCnt}</td>
                <td>{boardItem.crtDt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {token && isSelect && !isWriteMode && (
        <BoardView
          myInfo={myInfo}
          token={token}
          selectedBoardId={selectedBoardId}
          setSelectedBoardId={setSelectedBoardId}
          setNeedReload={setNeedReload}
        />
      )}
      {isWriteMode && (
        <WriteBoardForm
          token={token}
          setIsWriteMode={setIsWriteMode}
          setNeedReload={setNeedReload}
        />
      )}
      {!token && <div>로그인이 필요합니다.</div>}
      {token && !isWriteMode && (
        <div className="button-area right-align">
          <button onClick={onWriteModeClickHandler}>게시글 등록</button>
        </div>
      )}
    </>
  );
}

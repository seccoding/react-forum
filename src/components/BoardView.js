import { useEffect, useState } from "react";

export default function BoardView({
  token,
  selectedBoardId,
  setSelectedBoardId,
}) {
  const [boardItem, setBoardItem] = useState();

  const onViewListClickHandler = () => {
    setSelectedBoardId(undefined);
  };

  useEffect(() => {
    const loadBoard = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/boards/${selectedBoardId}`,
        { method: "GET", headers: { Authorization: token } }
      );

      const json = await response.json();
      setBoardItem(json.body);
    };
    loadBoard();
  }, [token, selectedBoardId]);

  return (
    <div>
      {boardItem && (
        <div>
          <h3>{boardItem.subject}</h3>
          <div>
            작성자: {boardItem.memberVO.name} ({boardItem.email})
          </div>
          <div>조회수: {boardItem.viewCnt}</div>
          <div>작성일: {boardItem.crtDt}</div>
          {boardItem.mdfyDt && <div>수정일: {boardItem.mdfyDt}</div>}
          {boardItem.originFileName && (
            <div>첨부파일: {boardItem.originFileName}</div>
          )}
          <div>
            <pre>{boardItem.content}</pre>
          </div>
        </div>
      )}
      <div className="button-area right-align">
        <button onClick={onViewListClickHandler}>목록보기</button>
      </div>
    </div>
  );
}

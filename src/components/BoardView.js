import { useEffect, useState } from "react";
import UpdateBoardForm from "./UpdateBoardForm";
import { deleteOneBoard, loadOneBoard } from "../http/http";

export default function BoardView({
  token,
  myInfo,
  selectedBoardId,
  setSelectedBoardId,
  setNeedReload,
}) {
  const [boardItem, setBoardItem] = useState();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [needReloadDetail, setNeedReloadDetail] = useState();

  const onModifyClickHandler = () => {
    setIsUpdateMode(true);
  };

  const onDeleteClickHandler = async () => {
    const json = await deleteOneBoard(boardItem.id, token);
    if (json.body) {
      // 삭제 성공!
      // 목록 컴포넌트를 노출.
      setSelectedBoardId(undefined);
      setNeedReload(Math.random());
    } else {
      // 삭제 실패!!
      // 실패한 사유를 알려줘야한다.
      console.log(json);
      alert(json.errors);
    }
  };

  const onViewListClickHandler = () => {
    setSelectedBoardId(undefined);
  };

  useEffect(() => {
    const loadBoard = async () => {
      const json = await loadOneBoard(selectedBoardId, token);
      setBoardItem(json.body);
    };
    loadBoard();
  }, [token, selectedBoardId, needReloadDetail]);

  return (
    <div>
      {!boardItem && <div>데이터를 불러오는 중입니다.</div>}
      {boardItem && !isUpdateMode && (
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

      {isUpdateMode && (
        <UpdateBoardForm
          boardItem={boardItem}
          token={token}
          setIsUpdateMode={setIsUpdateMode}
          setNeedReload={setNeedReload}
          setNeedReloadDetail={setNeedReloadDetail}
        />
      )}
      <div className="button-area right-align">
        {!isUpdateMode &&
          myInfo &&
          boardItem &&
          (myInfo.email === boardItem.email || myInfo.adminYn === "Y") && (
            <>
              <button onClick={onModifyClickHandler}>수정</button>
              <button onClick={onDeleteClickHandler}>삭제</button>
            </>
          )}
        {!isUpdateMode && (
          <button onClick={onViewListClickHandler}>목록보기</button>
        )}
      </div>
    </div>
  );
}

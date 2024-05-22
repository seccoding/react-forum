import { useCallback, useEffect, useMemo, useState } from "react";
import BoardView from "./BoardView";
import WriteBoardForm from "./WriteBoardForm";
import { loadAllBoards } from "../http/http";
import { useFetch } from "../hooks/useFetch";

let pageNo = 0;

export default function BoardApp({ token, myInfo }) {
  const [selectedBoardId, setSelectedBoardId] = useState();
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [needReload, setNeedReload] = useState();

  const isSelect = selectedBoardId !== undefined;

  const fetchLoadAllBoards = useCallback(loadAllBoards, []);
  const fetchParam = useMemo(() => {
    return { token, needReload };
  }, [token, needReload]);

  const { data, setData } = useFetch(undefined, fetchLoadAllBoards, fetchParam);
  console.log("data", data);

  const { count, pages, next } = data || {};
  const { body: boards } = data || {};

  const onRowClickHandler = (rowId) => {
    setSelectedBoardId(rowId);
  };

  const onLoadMoreClickHandler = async () => {
    const json = await loadAllBoards({ token, pageNo: ++pageNo });
    setData((prevData) => {
      return {
        ...prevData,
        next: json.next,
        pages: json.page,
        errors: json.errors,
        count: json.count,
        body: [...prevData.body, ...json.body],
      };
    });
  };

  const onWriteModeClickHandler = () => {
    setIsWriteMode(true);
  };

  return (
    <>
      {token && !isSelect && !isWriteMode && (
        <>
          <div>총 {count} 개의 게시글이 검색되었습니다.</div>
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
              {boards &&
                boards.map((boardItem) => (
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
        </>
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
          {next && <button onClick={onLoadMoreClickHandler}>더보기</button>}
          <button onClick={onWriteModeClickHandler}>게시글 등록</button>
        </div>
      )}
    </>
  );
}

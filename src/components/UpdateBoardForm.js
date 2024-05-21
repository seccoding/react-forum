import { useRef } from "react";

export default function UpdateBoardForm({
  boardItem,
  token,
  setIsUpdateMode,
  setNeedReload,
  setNeedReloadDetail,
}) {
  const subjectRef = useRef();
  const fileRef = useRef();
  const contentRef = useRef();

  const onCancelClickHandler = () => {
    setIsUpdateMode(false);
  };

  const onSaveClickHandler = async () => {
    const subject = subjectRef.current.value;
    const content = contentRef.current.value;
    const file = fileRef.current.files[0];

    // 파일 업로드를 위해 formData 생성
    const formData = new FormData(); // Javascript built-in 객체.
    formData.append("subject", subject);
    formData.append("content", content);
    formData.append("file", file);

    const response = await fetch(
      `http://localhost:8080/api/v1/boards/${boardItem.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );
    const json = await response.json();
    console.log(json);

    if (json.errors) {
      json.errors.forEach((error) => {
        alert(error);
      });
    } else if (json.body) {
      setIsUpdateMode(false);
      setNeedReload(Math.random());
      setNeedReloadDetail(Math.random());
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="subject">제목</label>
        <input
          type="text"
          id="subject"
          ref={subjectRef}
          defaultValue={boardItem.subject}
        />
      </div>
      <div>
        <label htmlFor="file">첨부파일</label>
        <input type="file" id="file" ref={fileRef} />
      </div>
      <div>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          ref={contentRef}
          defaultValue={boardItem.content}
        ></textarea>
      </div>
      <div className="button-area right-align">
        <button onClick={onCancelClickHandler}>취소</button>
        <button onClick={onSaveClickHandler}>수정</button>
      </div>
    </div>
  );
}

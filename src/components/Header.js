import { useRef, useEffect } from "react";

export default function Header({ token, setToken }) {
  const emailRef = useRef();
  const passwordRef = useRef();

  // 이 컴포넌트가 실행되자마자 Local Storage에 token 값이 있는지 확인한다.
  // Token 값이 있다면 token state에 값을 할당.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  const onLoginClickHandler = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email) {
      alert("Email을 입력하세요.");
      emailRef.current.focus();
      return;
    }

    if (!password) {
      alert("비밀번호를 입력하세요.");
      passwordRef.current.focus();
      return;
    }

    const response = await fetch("http://localhost:8080/auth/token", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    setToken(json.token);

    // token의 값을 브라우저의 로컬 스토리지에 작성한다.
    localStorage.setItem("token", json.token);
  };

  return (
    <header>
      {token && <div>로그인이 완료되었습니다.</div>}
      {!token && (
        <div>
          <label htmlFor="email">EMAIL</label>
          <input type="email" id="email" placeholder="Email" ref={emailRef} />

          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            ref={passwordRef}
          />

          <button onClick={onLoginClickHandler}>로그인</button>
        </div>
      )}
    </header>
  );
}

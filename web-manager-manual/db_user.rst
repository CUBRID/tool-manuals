***********************
데이터베이스 사용자
***********************

.. image:: /images/db-user.png

데이터베이스 → **사용자(Users)** 폴더 우클릭 → **사용자 추가(Add User)** 를 선택하면 **사용자 생성(Create User)** 모달이 열린다.
탭 구성: **식별 정보(Identity)** (Username, Description, 비밀번호, 그룹/멤버 설정), **권한(Permissions)**.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Username(사용자 이름) \* 만 필수이며, 값이 없으면 **사용자 생성(Create User)**
    버튼 자체가 비활성화된다. Description, Password/Password Confirm은 화면상 선택 입력이다 — Password를 비워두면
    비밀번호 없는 사용자로 생성된다 (CUBRID에서 자체적으로 허용되는 구성이지만, 운영 환경에서는 권장하지 않는다).

.. note::

    생성에 성공하면 트리에 사용자 이름이 대문자로 표시된다. CUBRID가 식별자를 대문자로 변환하기 때문이며, 오류가 아니다.

우클릭 메뉴로 사용자 수정(**사용자 편집(Edit user)**), 삭제(**사용자 삭제(Delete user)**)도 가능하다.

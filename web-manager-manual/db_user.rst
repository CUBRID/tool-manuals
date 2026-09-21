***********************
데이터베이스 사용자
***********************

CUBRID 데이터베이스 안에 실제로 존재하는 DB 계정(``db_user``/``db_authorization`` 시스템 카탈로그)을 관리하는
화면이다. NCA 자체 로그인 계정(:doc:`auth`)이나 호스트의 CMS 관리자 계정(:doc:`host` 의 "CMS 사용자 관리")과는
완전히 별개의 계정 체계이다.

.. image:: /images/db-user.png

데이터베이스 → **사용자(Users)** 폴더 우클릭 → **사용자 추가(Add User)** 를 선택하면 **사용자 생성(Create User)** 대화창이 열린다.
탭 구성: **식별 정보(Identity)** (Username, Description, 비밀번호, 그룹/멤버 설정), **권한(Permissions)**.

.. note::

    사용자 추가/수정/삭제는 SQL문(``CREATE USER`` 등)을 직접 실행하는 화면이 아니라, CMS를 통해 데이터베이스
    사용자 정보를 바로 반영하는 전용 화면이다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Username(사용자 이름) \* 만 필수이며, 값이 없으면 **사용자 생성(Create User)**
    버튼 자체가 비활성화된다. Description, Password/Password Confirm은 화면상 선택적으로 입력할 수 있는 값이다 — Password를 비워두면
    비밀번호 없는 사용자로 생성된다 (CUBRID에서 자체적으로 허용되는 구성이지만, 운영 환경에서는 권장하지 않는다).

.. note::

    생성에 성공하면 트리에 사용자 이름이 대문자로 표시된다. CUBRID가 식별자를 대문자로 변환하기 때문이며, 오류가 아니다.

우클릭 메뉴로 사용자 수정(**사용자 편집(Edit user)**), 삭제(**사용자 삭제(Delete user)**)도 가능하다.

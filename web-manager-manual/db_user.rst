***********************
데이터베이스 사용자
***********************

CUBRID 데이터베이스 안에 실제로 존재하는 DB 계정(``db_user``/``db_authorization`` 시스템 카탈로그)을 관리하는
화면이다. NCA 자체 로그인 계정(:doc:`auth`)이나 호스트의 CMS 관리자 계정(:doc:`host_operations` 의 "CMS 사용자 관리")과는
완전히 별개의 계정 체계이다.

.. image:: /images/database-users-menu.png
   :width: 520px

**사용자(Users)** 폴더를 우클릭하면 위와 같은 메뉴가 열린다.

.. image:: /images/db-user.png

데이터베이스 → **사용자(Users)** 폴더 우클릭 → **사용자 추가(Add User)** 를 선택하면 **사용자 생성(Create User)** 대화창이 열린다.
필드는 다음과 같다.

* 사용자 이름(Username)
* 설명(Description)
* 새 비밀번호(New Password)
* 비밀번호 확인(Password Confirm)

.. note::

    사용자 추가/수정/삭제는 SQL문(``CREATE USER`` 등)을 직접 실행하는 화면이 아니라, CMS를 통해 데이터베이스
    사용자 정보를 바로 반영하는 전용 화면이다.

.. note::

    Username(사용자 이름) \* 만 필수이며, 값이 없으면 **사용자 생성(Create User)** 버튼 자체가 비활성화된다.
    Password/Password Confirm은 선택적으로 입력할 수 있는 값이다 — 비워두면 비밀번호 없는 사용자로 생성된다.

.. note::

    생성에 성공하면 트리에 사용자 이름이 대문자로 표시된다. CUBRID가 식별자를 대문자로 변환하기 때문이며, 오류가 아니다.

사용자 편집(Edit User)
========================

.. image:: /images/db-user-edit.png

사용자 우클릭 → **사용자 편집(Edit User)** 을 선택하면 사용자 생성과 같은 대화창이 "편집" 모드로 열린다.

* **사용자 이름(Username)** 은 수정할 수 없다 — 필드가 잠긴 채로 표시된다.
* **새 비밀번호(New Password)** / **비밀번호 확인(Password Confirm)** 은 선택적으로 입력할 수 있는 값이다.
  비워두면 기존 비밀번호가 그대로 유지된다.

사용자 삭제(Delete User)
==========================

.. image:: /images/db-user-delete-confirm.png

사용자 우클릭 → **사용자 삭제(Delete User)** 를 선택하면 **데이터베이스 사용자 삭제** 확인 대화창이 열린다.
삭제할 사용자 이름과 소속 데이터베이스가 표시되며, 이 작업은 되돌릴 수 없다는 경고와 함께 **취소** / **사용자 삭제**
버튼이 있다.

*********************
로그인 / 회원가입
*********************

로그인(Login)
==============

.. image:: /images/login.png

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 필드
      - 설명
    * - 사용자 이름(Username) \*
      - —
    * - 비밀번호(Password) \*
      - 옆 눈 모양 아이콘으로 표시/숨김 토글

회원가입(Register)
====================

.. image:: /images/register.png

필드는 다음과 같다.

* 사용자 이름(Username)
* 비밀번호(Password) — 4단계 강도 표시: Weak/Average/Good/Strong
* 비밀번호 확인(Password Confirm)

* 비밀번호 규칙: 최소 8자, 영문자와 숫자를 각각 1개 이상 포함해야 한다.
* Username은 최소 3자 이상이어야 하며, 다른 계정과 중복될 수 없다.
* 정상 가입 후에는 로그인 화면으로 이동한다.

계정 프로필(Account Profile) / 비밀번호 변경(Change Password)
================================================================

.. image:: /images/auth-account-profile.png

로그인 후 우측 상단의 계정 pill(사용자 이름)을 클릭하면 **계정 프로필** 대화창이 열린다. 로그인한 NCA 계정의
사용자 이름과 역할, 계정 정보가 표시된다.

.. important::

    여기서 바꾸는 비밀번호는 **NCA 로그인 계정 자체의 비밀번호**\ 이다. 개별 CUBRID 호스트(CMS)에 접속할 때
    쓰는 :doc:`host_operations` 의 "Edit Host" 비밀번호나, 데이터베이스 사용자 비밀번호(:doc:`db_user`)와는 서로 다른 별개의
    값이니 혼동하지 않는다.

.. image:: /images/auth-account-change-password.png

**비밀번호 변경** 버튼을 누르면 별도 대화창이 열린다. 필드: **현재 비밀번호**, **새 비밀번호**, **새 비밀번호 확인**.

새 비밀번호 규칙은 회원가입과 동일하다: 최소 8자, 영문자와 숫자를 각각 1개 이상 포함해야 한다. 화면 자체에는
실시간 검증 표시가 없고, 조건을 만족하지 않으면 저장 시 서버에서 오류가 반환된다.

로그아웃(Logout) / 언어 전환(Language)
========================================

.. image:: /images/auth-header-controls.png

**로그아웃(Logout)** 버튼을 누르면 확인창이 뜨고, 확인하면 로그인 화면으로 돌아갈 수 있다.

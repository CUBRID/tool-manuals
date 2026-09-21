***************
호스트 관리
***************

NCA가 관리할 CUBRID 서버(호스트)를 등록·삭제하고 그룹으로 묶어 관리하는 화면이다. 여기서 "호스트에 로그인"한다는 것은
NCA 서버가 해당 호스트에서 실행 중인 CMS(CUBRID Manager Server)의 API에 접속하는 것이며, CUBRID 엔진에 직접 접속하는
것이 아니다.

사이드바 상단 섹션명은 **서버 목록(Server List)** 이며, 툴바에 **+ Add** (호스트 추가), **새 그룹(New Group)**, (호스트가 1개 이상이면) **전체 로그인(Login All)** 버튼이 있다.

.. image:: /images/host-tree.png

호스트 추가
===========

.. image:: /images/host-add.png

툴바 **+ Add** 를 클릭하면 **새 연결(New Connection)** 대화창이 열린다. 대화창의 섹션 구성은 다음과 같다.

.. list-table::
    :header-rows: 1
    :widths: 20 30 15 15

    * - 구분
      - 항목
      - 필수 여부
      - 기본값
    * - 식별 정보(Identity)
      - Alias(별칭)
      - 필수
      - —
    * - 식별 정보(Identity)
      - Group
      - 선택
      - No group
    * - 호스트(Host)
      - IP Address / Domain(주소)
      - 필수
      - —
    * - 호스트(Host)
      - Port(포트)
      - 필수
      - 8001
    * - 인증 정보(Credentials)
      - Username(사용자 이름)
      - 필수
      - —
    * - 인증 정보(Credentials)
      - Password(비밀번호)
      - 필수
      - —

하단 버튼: **취소(Cancel)** / **변경 저장(Save Changes)** (로그인 없이 저장만) / **연결 테스트 및 저장(Test Connection & Save)** (연결 확인 후 즉시 로그인까지).

* 빈 값으로 제출하면 각 필드에 대해 필수 입력 오류가 표시된다.
* 이미 등록된 주소:포트로 추가하면 중복 오류가 표시된다.

.. note::

    **저장(Save Changes)** 을 누르는 시점에는 호스트에 아무 요청도 가지 않는다 — 입력한 값이 그대로 저장될 뿐이다.
    실제로 호스트에 접속을 시도하는 것은 **연결 테스트 및 저장** 을 눌렀을 때뿐이다.

호스트 수정
===========

우클릭 → **호스트 편집(Edit Host)** 를 선택하면 **호스트 수정(Modify Host)** 대화창이 열린다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. Alias(별칭) \*, IP Address / Domain(주소) \*, Port(포트) \*,
    Username(사용자 이름) \* 는 반드시 입력해야 한다. Credentials의 **새 비밀번호(New Password)** (비워두면 기존 비밀번호 유지)는
    선택적으로 입력할 수 있는 값이다.

.. warning::

    **연결 테스트 및 저장(Test Connection & Save)** 는 로그인 시도 *전에* 새 비밀번호를 먼저 저장한다. 즉 비밀번호를 잘못 입력해서 로그인이 실패해도
    저장된 비밀번호는 이미 잘못된 값으로 덮어써진 상태이다. 로그인 실패 시 즉시 올바른 비밀번호로 다시 저장해야 접속이 복구된다.

호스트 삭제
===========

우클릭 → **호스트 삭제(Delete Host)** 를 선택하면 **호스트 연결 제거(Remove Host Connection)** 대화창이 열린다. 이 작업은 되돌릴 수 없다.
버튼: **유지(Keep Host)** (취소) / **제거 확인(Confirm Removal)** (삭제).

전체 로그인 (Login All)
========================

.. image:: /images/host-login-all-result.png
   :width: 340px

툴바의 **전체 로그인(Login All)** 버튼(로그인 안 된 호스트가 1개 이상 있을 때만 표시)을 클릭하면, 저장된 비밀번호로
아직 로그인하지 않은 호스트 전체에 한 번에 로그인을 시도한다. 완료되면 성공/실패 호스트 개수를 요약한 결과 대화창이
뜨며, 실패한 호스트는 이름과 실패 사유가 함께 표시된다. 로그인이 필요한 호스트가 하나도 없으면 버튼 자체가
보이지 않는다.

.. note::

    그룹 우클릭 메뉴에도 같은 기능이 있으며, 이 경우 해당 그룹에 속한 호스트로만 범위가 좁혀진다.

그룹 생성 / 이름 변경
=====================

툴바 **새 그룹(New Group)** 또는 그룹 우클릭 → **그룹 이름 변경(Rename Group)** 을 선택한다. 필드는 **그룹 이름(Group Name)** \* 하나이며, 필수 입력 항목이다
(비워두고 저장하면 "그룹 이름을 입력하세요." 오류가 표시된다).

그룹 삭제
=========

그룹 우클릭 → **그룹 삭제(Delete Group)** 을 선택한다.

.. warning::

    그룹 안에 호스트가 있으면 경고와 함께 그 호스트들도 전부 영구 삭제된다. **Ungrouped로 옮겨지지 않는다.**

그룹 멤버 관리
==============

그룹 우클릭 → **그룹 관리(Manage Group)** 을 선택한다. 호스트 목록에서 체크하면 그룹에 추가되고, 체크 해제하면 Ungrouped로 이동한다.
저장 후 그룹이 자동으로 펼쳐지지 않으므로 직접 펼쳐서 확인한다.

CMS 사용자 관리
===============

로그인된 호스트 우클릭 → **사용자 관리(User Management)** 를 선택한다.

.. note::

    "CMS 사용자"는 CUBRID DB 사용자나 NCA 로그인 계정과는 별개로, 호스트에 연결된 CMS 관리자 계정을 뜻한다.

섹션: **시스템 관리자(System administrator)**, **관리 사용자(Management users)** (각 행에 DB creation authority / Broker authority / Status monitor authority가 표시된다).

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다. **사용자 추가(Add User)** 대화창에서 Login ID(로그인 ID) \* 는 항상 필수이며,
    Password(비밀번호) \* 는 신규 사용자를 추가할 때만 필수이다. 이미 있는 사용자를 수정할 때는 비밀번호를 비워두면
    기존 값이 유지되지만, 비밀번호를 입력했다면 Password Confirm(비밀번호 확인) \* 도 함께 입력해야 한다.

* **사용자 추가(Add User)** 로 로그인 ID/비밀번호와 권한(각각 none/admin, none/monitor/admin)을 설정해 추가한다.
* 행에 마우스를 올리면 수정/삭제 아이콘이 나타난다. 기본 admin 계정은 삭제할 수 없다.

비밀번호 변경
=============

로그인된 호스트 우클릭 → **비밀번호 변경(Change Password)** 를 선택하면 **관리자 비밀번호 변경(Change Manager Password)** 대화창이 열린다.
필드: New Password(새 비밀번호) \*, Verify New Password(비밀번호 확인) \* — 둘 다 필수 입력 항목이며 서로 일치해야 한다.
호스트의 CMS 관리자 비밀번호 자체를 바꾸는 것이며, NCA에 저장된 호스트 접속 비밀번호는 자동으로 갱신되지 않는다
— 그래서 아래 경고처럼 실패 시 되돌리는 것이 중요하다.

.. warning::

    비밀번호를 바꾼 뒤 실제로 반영됐는지 꼭 확인한다. 실패 시 즉시 원래 비밀번호로 되돌리는 것을 권장한다.

서버 버전
=========

.. image:: /images/host-server-version.png

호스트 우클릭 → **서버 버전(Server Version)** 을 선택하거나, 상단 **도움말(Help)** 메뉴 → **서버 버전(Server Version)** 을 선택하면(이 경우
사이드바에서 호스트가 선택되어 있어야 활성화된다) 열린다. CMS에서 조회한 환경 정보를 보여주는 읽기 전용 화면이다.

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 항목
      - 설명
    * - CUBRID 버전(CUBRID Version)
      - CUBRID 엔진 버전
    * - OS(OS Platform)
      - 호스트의 OS/플랫폼 정보
    * - 브로커(Broker)
      - 브로커 버전
    * - 설치 경로(Install Path)
      - CUBRID 설치 경로
    * - 데이터베이스(Databases)
      - 데이터베이스가 저장되는 경로

다중 호스트 선택 (일괄 작업)
============================

.. image:: /images/host-bulk-select.png
   :width: 420px

Ctrl/Cmd-클릭으로 호스트를 하나씩 추가 선택하거나, Shift-클릭으로 마지막에 클릭한 호스트부터 범위 선택할 수 있다
(그룹이 달라도 함께 선택 가능하다).

선택된 상태에서 우클릭하면 다음과 같은 일괄 작업 메뉴가 뜬다.

.. image:: /images/host-bulk-context-menu.png
   :width: 240px

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 항목
      - 설명
    * - 선택한 호스트 로그인(Login Selected Hosts)
      - 선택된 호스트 중 아직 로그인되지 않은 것만 로그인한다 (이미 로그인된 호스트는 건너뛴다).
    * - 그룹으로 이동(Move to Group)
      - 하위 메뉴에서 "Ungrouped" 또는 기존 그룹 중 하나를 선택하면 선택된 호스트 전부가 그 그룹으로 이동한다.
    * - 선택한 호스트 삭제(Delete Selected Hosts)
      - 확인 대화창이 뜨며, 선택한 호스트 개수가 표시된다.

**선택한 호스트 삭제** 를 누르면 다음 확인 대화창이 뜬다.

.. image:: /images/host-bulk-delete-confirm.png
   :width: 420px

.. warning::

    선택한 호스트 전부의 연결 정보와 저장된 자격 증명/설정 프로필이 함께 영구 삭제되며, 되돌릴 수 없다.

호스트 내보내기 / 가져오기
==========================

상단 **파일(File)** 메뉴 → **호스트 내보내기(Export Host)** / **호스트 가져오기(Import Host)** 를 선택하면 각각 전용 대화창이 열린다.
두 대화창 모두 호스트 목록을 체크박스가 있는 표로 보여주며, 상단의 **전체 선택** 체크박스로 한 번에 모두 선택하거나 해제할 수 있다.

.. image:: /images/host-export.png

**호스트 내보내기(Export Host)** 대화창에는 현재 등록된 모든 호스트가 표에 나열된다. 체크된 호스트만 내보내기 대상이 된다.

형식 드롭다운 옵션은 다음과 같다(로케일과 무관하게 항상 다음 영문 그대로 표시된다).

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 형식
      - 설명
    * - Next CUBRID Admin XML
      - 자체 XML 포맷 (기본값)
    * - Next CUBRID Admin JSON
      - 자체 JSON 포맷
    * - CUBRID Admin XML
      - 레거시 CUBRID Admin으로 가져올 수 있는 호환 XML

**파일명** — 기본값은 "export_servers"이며 직접 수정할 수 있다. 확장자는 형식에 따라 자동으로 붙는다: JSON 형식은 ``.JSON``,
나머지 두 XML 형식은 ``.XML``.

.. note::

    어떤 형식으로 내보내도 비밀번호는 포함되지 않는다.

.. image:: /images/host-import.png

**호스트 가져오기(Import Host)** 대화창은 처음에 파일 선택 화면만 보여준다. ``.xml`` / ``.json`` / ``.prefs`` / ``.properties`` /
``.txt`` 파일을 드래그 앤 드롭하거나 클릭하여 선택한다. 지원 형식은 화면에 표시된 다음 안내 문구 그대로다: "Next CUBRID Admin
XML/JSON, CUBRID Admin 호스트 XML, 또는 레거시 데스크톱 .prefs / .properties 파일입니다. 형식이 지원하는 경우 호스트 그룹도
보존됩니다. .prefs의 암호화된 비밀번호는 가져오지 않습니다."

파일을 선택하면 파싱된 호스트가 체크박스가 있는 표로 바뀐다.

* 이미 등록된 주소:포트와 일치하는 행에는 **중복** 배지가 붙고 선택할 수 없다.
* 유효성 검사에 실패한 행에는 **유효하지 않음** 배지가 붙고, 실패 사유가 행에 함께 표시된다.
* 그룹 정보가 없는 호스트는 화면에서 지정한 그룹 이름(기본값 "Imported")으로 한꺼번에 등록된다.

.. note::

    가져오기가 끝난 뒤 비밀번호 없이 추가된 호스트가 있으면, 호스트별로 비밀번호를 입력하는 후속 화면이 뜬다(입력과 동시에 전체
    로그인까지 할 수 있는 옵션도 있다). 이 단계는 건너뛸 수 있다.

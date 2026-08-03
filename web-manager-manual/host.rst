***************
호스트 관리
***************

사이드바 상단 섹션명은 **Server List** 이며, 툴바에 **+ Add** (호스트 추가), **New Group**, (호스트가 1개 이상이면) **Login All** 버튼이 있다.

.. image:: /images/host-tree.png

호스트 추가
===========

.. image:: /images/host-add.png

툴바 **+ Add** 를 클릭하면 **New Connection** 모달이 열린다. 섹션 구성:

* **Identity** — Alias, Group 드롭다운 (기본값: "No group")
* **Host** — IP Address / Domain, Port (기본값: 8001)
* **Credentials** — Username, Password

하단 버튼: **Cancel** / **Save Changes** (로그인 없이 저장만) / **Test Connection & Save** (연결 확인 후 즉시 로그인까지).

* 빈 값으로 제출하면 각 필드에 대해 필수 입력 오류가 표시된다.
* 이미 등록된 주소:포트로 추가하면 중복 오류가 표시된다.

호스트 수정
===========

우클릭 → **Edit Host** 를 선택하면 **Modify Host** 모달이 열린다. Credentials에 **New Password** (비워두면 기존 비밀번호 유지)가 있다.

.. warning::

    **Test Connection & Save** 는 로그인 시도 *전에* 새 비밀번호를 먼저 저장한다. 즉 비밀번호를 잘못 입력해서 로그인이 실패해도
    저장된 비밀번호는 이미 잘못된 값으로 덮어써진 상태이다. 로그인 실패 시 즉시 올바른 비밀번호로 다시 저장해야 접속이 복구된다.

호스트 삭제
===========

우클릭 → **Delete Host** 를 선택하면 **Remove Host Connection** 모달이 열린다. 이 작업은 되돌릴 수 없다.
버튼: **Keep Host** (취소) / **Confirm Removal** (삭제).

그룹 생성 / 이름 변경
=====================

툴바 **New Group** 또는 그룹 우클릭 → **Rename Group** 을 선택한다. 필드는 **Group Name** 하나이다.

그룹 삭제
=========

그룹 우클릭 → **Delete Group** 을 선택한다.

.. warning::

    그룹 안에 호스트가 있으면 경고와 함께 그 호스트들도 전부 영구 삭제된다. **Ungrouped로 옮겨지지 않는다.**

그룹 멤버 관리
==============

그룹 우클릭 → **Manage Group** 을 선택한다. 호스트 목록에서 체크하면 그룹에 추가되고, 체크 해제하면 Ungrouped로 이동한다.
저장 후 그룹이 자동으로 펼쳐지지 않으므로 직접 펼쳐서 확인한다.

CMS 사용자 관리
===============

로그인된 호스트 우클릭 → **User Management** 를 선택한다.

.. note::

    "CMS 사용자"는 CUBRID DB 사용자나 웹매니저 로그인 계정과는 별개로, 호스트에 연결된 CMS 관리자 계정을 뜻한다.

섹션: **System administrator**, **Management users** (각 행에 DB creation authority / Broker authority / Status monitor authority가 표시된다).

* **Add User** 로 로그인 ID/비밀번호와 권한(각각 none/admin, none/monitor/admin)을 설정해 추가한다.
* 행에 마우스를 올리면 수정/삭제 아이콘이 나타난다. 기본 admin 계정은 삭제할 수 없다.

비밀번호(Passcode) 변경
=======================

로그인된 호스트 우클릭 → **Change Password** 를 선택하면 **Change Manager Passcode** 모달이 열린다.

.. warning::

    비밀번호를 바꾼 뒤 실제로 반영됐는지 꼭 확인한다. 실패 시 즉시 원래 비밀번호로 되돌리는 것을 권장한다.

호스트 내보내기 / 가져오기
==========================

상단 **File** 메뉴 → **Export Host** / **Import Host** 를 선택한다. Export는 확인창 없이 바로 파일을 다운로드하며,
Import 시 이미 등록된 호스트는 DUPLICATE 배지가 붙고 체크할 수 없다.

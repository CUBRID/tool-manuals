************************************
데이터베이스 트리 / 라이프사이클
************************************

.. image:: /images/database-tree.png

데이터베이스 노드를 펼치면 **Users**, **Job automation**, **Space** 하위 노드가 나타난다.
우클릭 → **Manage Database** 안에 Unload Database, Load Database, Check Database, Compact Database,
Optimize Database, Copy Database, Rename Database, Restore Database, Backup Database, Delete Database가 있다.

.. note::

    Rename/Restore/Delete는 데이터베이스가 실행 중이면 비활성화된다. 먼저 중지해야 한다.

데이터베이스 생성
==================

.. image:: /images/database-create.png

"Databases" 트리 루트 우클릭 → **Create Database** 를 선택하면 5단계 마법사가 열린다:
General Information → Additional Volume Information → Automatic volume extension → Set DBA Password → Database Information(검토).

#. Database name을 입력하고, 필요하면 "Start database after creation" 여부를 선택한다.
#. 추가 볼륨이 필요 없으면 그대로 다음으로 진행한다.
#. 자동 확장 설정(기본값을 그대로 사용해도 된다)을 확인한다.
#. Password/Password Confirm을 입력한다 (8자 미만이거나 서로 다르면 다음 단계로 진행할 수 없다).
#. 요약을 확인하고 **Finish** 를 클릭하면 실제 생성 작업이 시작된다. 완료까지 최대 2분 정도 걸릴 수 있다.

데이터베이스 로그인
====================

데이터베이스를 더블클릭하면 **Login Database** 모달이 열린다. User name(기본값 "dba")과 Password를 입력한다.
**Save Password** 를 켜두면 다음부터 다시 입력하지 않아도 된다.

시작 / 중지
===========

우클릭 시 **Stop Database** 와 **Start Database** 중 정확히 하나만 보인다.

.. note::

    Copy Database 같은 무거운 작업 직후에는 몇 분간 로그인이 일시적으로 지연될 수 있다. 앱의 문제가 아니라 CMS 호스트 자체의 특성이다.

이름 변경
=========

Manage Database → **Rename Database** (실행 중이면 비활성화). "서비스가 완전히 중지된 상태인지 확인하라"는 경고가 표시된다.
**New Database Name** 을 입력해야 실행 버튼이 활성화된다.

복사
====

Manage Database → **Copy Database** (원본이 중지 상태여야 한다). 대상 Database Name과 목적지 경로를 입력한다.
**Delete Source After Copy** 는 위험한 옵션이므로 신중하게 사용한다.

점검 / 압축 / 최적화
====================

Manage Database 안의 **Check Database**, **Compact Database**, **Optimize Database** 는 모두 옵션을 선택하고
**OK** 를 누르면 작업이 시작되는 단순한 진단성 실행 다이얼로그이다.

삭제
====

Manage Database → **Delete Database** 는 2단계로 진행된다.

#. 삭제될 볼륨 목록과 경고를 확인하고 **Proceed** 를 클릭한다.
#. DBA User name/Password를 다시 입력하고 **Delete** 를 클릭한다.

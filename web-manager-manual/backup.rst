*******************************
백업 / 복원 / 언로드 / 로드
*******************************

즉시 백업 실행
==============

.. image:: /images/backup-database.png

Manage Database → **Backup Database** 를 선택한다. 필드: **Backup Level** (0/1/2), **Backup Directory**
(모든 레벨이 이 디렉터리 하나를 공유한다).

.. note::

    이전 버전에 있던 "Volume Name" 입력란은 제거되었다. Backup Directory 하나만 입력하면 된다.

백업 계획 (예약 백업)
=====================

.. image:: /images/backup-plan.png

데이터베이스 → Job automation → **Backup Plan** 폴더 우클릭 → **Create Backup Plan** 을 선택한다.
Plan ID, Type(Full/L0, Inc. L1, Inc. L2), Path, 실행 스케줄(반복 주기, 시각), 최적화 옵션 등을 설정한다.

.. warning::

    CMS 호스트의 OS 사용자가 기본 백업 디렉터리에 쓰기 권한이 없으면 "Permission denied" 오류가 발생할 수 있다.
    이는 환경 설정 문제이며 앱의 오류가 아니다. 그 외의 오류 메시지가 표시되면 실제 문제일 가능성이 높다.

복원
====

Manage Database → **Restore Database** (데이터베이스가 중지 상태여야 한다). 복원 시점 선택 또는 백업 레벨별 파일을 직접 지정할 수 있다.

언로드
======

Manage Database → **Unload Database...** 를 선택한다. 대상 디렉터리, 스키마/데이터 포함 범위, 테이블 선택 등을 설정한다.

로드
====

Manage Database → **Load Database...** 를 선택한다.

.. warning::

    Load의 기본 대상은 기존 데이터베이스이므로, 잘못 실행하면 실제 데이터를 덮어쓸 수 있다. 실행 전 대상 데이터베이스명을 반드시 확인한다.

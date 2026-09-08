**************************
알려진 제약사항 / 문제
**************************

제약사항
========

* 호스트는 계정당 최대 400개까지 등록할 수 있다.
* 백업/복원/언로드/로드/생성 등 CMS의 오래 걸리는(async) 작업은 최대 12시간까지 진행 상태를 추적한다 (기본값,
  api-server의 ``CMS_JOB_LONG_TIMEOUT_HOURS`` 환경변수로 조정 가능). 그 이상 걸리면 더 이상 추적하지 않는다.

데이터베이스 유틸리티 동시 실행 제약
======================================

Manage Database의 각 작업은 CUBRID 엔진 자체의 제약을 그대로 물려받는다.

* **오프라인 전용(standalone-only) 작업** — Create Database, Copy Database, Rename Database,
  Restore Database, Optimize Database, Compact Database, Delete Database, Load Database. 이 작업들은
  대상 데이터베이스 볼륨 파일에 OS 레벨 배타 락(``fcntl`` write lock)을 걸고 실행되므로, 같은 데이터베이스에 대해
  이미 다른 프로세스(콘솔에서 직접 실행한 것 포함)가 이 중 하나를 실행 중이면 두 번째 시도는 안전하게 거부된다
  (에러로 실패할 뿐 데이터가 손상되지는 않는다).
* **온라인 상태에서도 실행 가능한 작업** — Unload Database, Check Database, Add Database Volume,
  Backup Database. 이 네 작업은 데이터베이스가 실행 중인 상태에서도 실행할 수 있지만, 이를 위한 별도의 상호
  배제 장치가 엔진에 없다. 같은 데이터베이스에 대해 이 중 하나를 두 번 이상 동시에 실행하면(webmanager를 통해서든,
  콘솔에서 직접 실행하든) 이를 막아주는 장치가 없으므로 실행 결과가 보장되지 않는다.

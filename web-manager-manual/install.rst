************************
설치 / 배포 / 패키징
************************

이 장은 CUBRID Web Manager 서버를 직접 설치·배포하는 담당자를 위한 내용이다. 이미 배포된 서버에 접속만 하는
베타 테스터는 :doc:`access` 부터 보면 된다.

배포 방식
=========

두 가지 방식 중 하나를 선택한다.

방법 A — Node.js 직접 실행
--------------------------

.. code-block:: bash

    npm run build:server
    # → dist/apps/api-server/main.js + dist/apps/api-server/public/ 생성

배포 서버에서 ``cwm.conf`` 를 설정한 뒤 실행한다.

.. code-block:: bash

    node dist/apps/api-server/main.js

방법 B — 단일 실행파일 패키징 (권장)
------------------------------------

Node.js 설치 없이 실행 가능한 실행파일로 패키징한다.

.. code-block:: bash

    npm run package:server           # 전 플랫폼 동시
    npm run package:server:linux     # Linux용
    npm run package:server:win       # Windows용
    npm run package:server:mac       # macOS용

결과물은 ``dist/executables/`` 아래에 생성된다.

.. code-block:: text

    dist/executables/
      ├── cubrid-web-manager-linux          # Linux 실행파일 (Node.js + 프론트엔드 내장)
      ├── cubrid-web-manager-macos          # macOS 실행파일
      ├── cubrid-web-manager.exe            # Windows 실행파일
      └── conf/
          └── cwm.conf.sample                # 설정 파일 샘플 → cwm.conf로 복사 후 편집

업데이트할 때는 실행파일만 교체하면 되고, ``conf/`` 는 건드리지 않는다.

cwm.conf 설정
=============

``conf/cwm.conf.sample`` 을 ``conf/cwm.conf`` 로 복사한 뒤 편집한다.

.. code-block:: json

    {
      "PORT": "8080",
      "ENVIRONMENT": "production",
      "STORAGE_PATH": "./data"
    }

자주 쓰는 설정 키:

.. list-table::
    :header-rows: 1
    :widths: 25 55 20

    * - 키
      - 설명
      - 기본값
    * - ``PORT``
      - 서버 포트
      - ``8080``
    * - ``ENVIRONMENT``
      - ``production`` / ``development``
      - ``production``
    * - ``STORAGE_PATH``
      - 데이터 저장 경로
      - ``./data``
    * - ``ALLOWED_ORIGINS``
      - CORS 허용 도메인 (쉼표 구분, 없으면 전체 허용)
      - —
    * - ``LISTEN_HOST``
      - 바인드할 네트워크 인터페이스 (예: ``127.0.0.1`` 로 로컬 전용 제한)
      - 전체 인터페이스
    * - ``SSL_CERT_PATH`` / ``SSL_KEY_PATH``
      - 공인 인증서 경로 (없으면 자체 서명 인증서 자동 생성)
      - —
    * - ``AUTH_REGISTRATION_ENABLED``
      - 신규 계정 가입 허용 여부 (초기 설정 후 ``false`` 로 잠그기 권장)
      - ``true``
    * - ``LOG_TO_FILE`` / ``LOG_DIR`` / ``LOG_LEVEL`` / ``LOG_MAX_SIZE`` / ``LOG_MAX_FILES`` / ``LOG_APPEND_ON_RESTART``
      - 파일 로깅 관련 설정 (용량/기간 기준 로테이션 등)
      - 실행파일 옆 ``logs/``

.. note::

    전체 키와 예시 값은 저장소의 ``cwm.conf.reference.md`` 를 참고한다 (패키징된 실행파일의 ``conf/`` 폴더에도 함께 포함되어 있다).

.. warning::

    ``SEED`` / ``SALT`` 는 ``cwm.conf`` 에 넣어도 무시된다 (안전장치). 최초 실행 시 자동 생성되어
    ``cwm-vault/secrets.json`` 에 저장되며, 이 파일을 삭제하면 저장된 모든 데이터를 복호화할 수 없게 된다.
    절대 편집하거나 삭제하지 않는다.

포트 변경
=========

``conf/cwm.conf`` 의 ``PORT`` 값을 수정하고 재시작한다.

.. code-block:: json

    { "PORT": "9090" }

이후 ``https://서버IP:9090`` 으로 접속한다.

첫 실행 동작
============

#. ``SEED`` / ``SALT`` 가 없으면 자동 생성되어 ``cwm-vault/secrets.json`` 에 저장된다.
#. ``ssl/`` 폴더에 자체 서명 인증서가 없으면 자동 생성된다.
#. 브라우저에서 ``https://서버IP:PORT`` 로 접속하면 인증서 경고가 한 번 뜨는데, 신뢰하고 넘어가면 이후 정상 사용할 수 있다.

실행
====

.. code-block:: bash

    # Linux
    ./cubrid-web-manager-linux

    # Windows
    cubrid-web-manager.exe

업데이트
========

새 버전을 배포할 때는 ``cubrid-web-manager-*`` 실행파일(또는 ``public/`` 폴더)만 교체한다.

.. warning::

    ``conf/cwm.conf`` 는 절대 덮어쓰지 않는다. ``SEED``/``SALT`` 가 초기화되면 기존에 저장된 데이터를 모두 잃는다.

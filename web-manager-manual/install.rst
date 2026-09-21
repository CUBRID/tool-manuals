********************************************
Next CUBRID Admin 설치 및 환경설정
********************************************

이 장은 Next CUBRID Admin 서버를 직접 설치·설정하는 관리자를 위한 내용이다. 이미 배포된 서버에 접속만 하는
일반 사용자는 이 장을 볼 필요 없이 :doc:`access` 부터 보면 된다.

배포 방식
=========

#. FTP 서버(``ftp.cubrid.com``\ 의 ``/dev/NCA/application``)에 접속하여 대상 플랫폼용 실행파일을 내려받는다.
#. 압축을 해제하면 다음과 같은 구성이다.

.. code-block:: text

    cubrid-web-manager/
      ├── cubrid-web-manager-linux          # Linux 실행파일
      ├── cubrid-web-manager-macos          # macOS 실행파일
      ├── cubrid-web-manager.exe            # Windows 실행파일
      └── conf/
          └── cwm.conf.sample                # 설정 파일 샘플 → cwm.conf로 복사 후 편집

업데이트할 때는 실행파일만 새로 받아 교체하면 되고, ``conf/`` 는 건드리지 않는다.

cwm.conf 설정
=============

``conf/cwm.conf.sample`` 을 ``conf/cwm.conf`` 로 복사한 뒤 편집한다.

.. code-block:: json

    {
      "PORT": "8080",
      "ENVIRONMENT": "production",
      "STORAGE_PATH": "./data"
    }

전체 설정 키는 다음과 같다.

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
      - ``production`` 또는 ``development`` 중 하나로 지정한다
      - ``production``
    * - ``STORAGE_PATH``
      - 애플리케이션 데이터가 저장되는 경로
      - ``./data``
    * - ``ALLOWED_ORIGINS``
      - CORS로 허용할 도메인 목록(쉼표로 구분). 비워두면 같은 출처(동일 도메인)에서 오는 요청만 허용한다
      - —
    * - ``LISTEN_HOST``
      - 서버가 응답을 받을 네트워크 인터페이스(예: ``127.0.0.1`` 로 지정하면 이 서버가 설치된 기기에서만 접속할
        수 있고 다른 기기의 접속은 거부된다)
      - 모든 인터페이스
    * - ``SSL_CERT_PATH`` / ``SSL_KEY_PATH``
      - 정식 발급받은 TLS 인증서/키 파일 경로. 둘 중 하나만 설정하면 안 되고 반드시 함께 설정해야 한다
      - 자체 서명 인증서를 자동으로 생성해 사용한다
    * - ``AUTH_REGISTRATION_ENABLED``
      - 신규 계정 가입을 허용할지 여부. 팀 계정 등록이 끝난 뒤에는 ``false`` 로 잠그는 것을 권장한다
      - ``true``
    * - ``CMS_REJECT_UNAUTHORIZED``
      - CUBRID CMS 호스트에 접속할 때 TLS 인증서를 검증할지 여부
      - ``false``
    * - ``CMS_CA_CERT_PATH``
      - 자체 서명 인증서를 쓰는 CMS 호스트를 신뢰하기 위해 필요한 CA 인증서 경로
      - —
    * - ``CMS_JOB_RETENTION_HOURS``
      - 복사/이름 변경/백업 등 완료된 백그라운드 작업 기록을 보관하는 시간(단위: 시간)
      - ``24``
    * - ``CMS_JOB_STALE_RUNNING_HOURS``
      - 작업이 이 시간을 넘겨도 끝나지 않으면 멈춘 것으로 간주한다(단위: 시간)
      - ``CMS_JOB_LONG_TIMEOUT_HOURS`` 값 + 1
    * - ``CMS_JOB_LONG_TIMEOUT_HOURS``
      - 언로드/로드처럼 오래 걸리는 작업을 얼마나 오래 기다릴지(단위: 시간)
      - ``12``
    * - ``CMS_JOB_RECOVER_ON_STARTUP``
      - 서버가 재시작됐을 때, 재시작 전에 진행 중이던 작업의 추적을 이어서 재개할지 여부
      - ``true``
    * - ``SERVER_IP``
      - 자체 서명 인증서에 포함할 IP 주소. 지정해두면 도메인 대신 IP로 접속했을 때 뜨는 브라우저 경고를 줄일 수 있다
      - 네트워크 인터페이스에서 자동으로 감지한 값
    * - ``CWM_SSL_DIR``
      - 자체 서명 인증서를 읽고 쓰는 디렉터리
      - 실행파일 옆 ``ssl/``
    * - ``LOG_TO_FILE``
      - 콘솔 출력 외에 파일에도 로그를 남길지 여부
      - ``true``
    * - ``LOG_DIR``
      - 로그 파일이 저장되는 디렉터리
      - 실행파일 옆 ``logs/``
    * - ``LOG_LEVEL``
      - 기록할 최소 로그 수준(``error``, ``warn``, ``log``, ``debug``, ``verbose`` 중 하나)
      - ``production`` 환경에서는 ``log``, 그 외에는 ``debug``
    * - ``LOG_MAX_SIZE``
      - 로그 파일이 이 크기를 넘으면 새 파일로 교체한다(예: ``20m``, ``500k``)
      - ``20m``
    * - ``LOG_MAX_FILES``
      - 교체된 로그 파일을 얼마나 보관할지. 기간(예: ``14d``)이나 개수로 지정할 수 있다
      - ``14d``
    * - ``LOG_APPEND_ON_RESTART``
      - ``true`` 로 설정하면 재시작해도 당일 로그 파일에 이어서 기록하고, ``false`` 로 설정하면 재시작할 때마다
        새 로그 파일로 시작한다
      - ``true``

.. important::

    ``SEED``/``SALT``는 저장된 호스트 접속 비밀번호 등 민감한 데이터를 암호화하는 키를 만드는 값이다. ``cwm.conf``
    에 직접 넣어도 무시되며, 최초 실행 시 자동 생성되어 ``cwm-vault/secrets.json`` 에 저장된다. 업데이트나 백업
    시에는 ``conf/`` 폴더와 이 ``secrets.json`` 파일이 함께 보존되어야 기존에 저장된 데이터를 계속 사용할 수 있다.

포트 변경
=========

``conf/cwm.conf`` 의 ``PORT`` 값을 수정하고 재시작한다.

.. code-block:: json

    { "PORT": "9090" }

이후 ``https://서버IP:9090`` 으로 접속한다.

첫 실행 동작
============

서버를 처음 실행하면 ``SEED``/``SALT``와 자체 서명 인증서가 자동 생성된다. 브라우저에서
``https://서버IP:PORT`` 로 접속하면 인증서 경고가 한 번 뜨는데, 신뢰하고 넘어가면 이후 정상 사용할 수 있다.

실행
====

.. code-block:: bash

    # Linux
    ./cubrid-web-manager-linux

    # Windows
    cubrid-web-manager.exe

업데이트
========

새 버전을 배포할 때는 ``cubrid-web-manager-*`` 실행파일(또는 ``public/`` 폴더)만 교체하고, ``conf/`` 폴더는
그대로 둔다 (위 SEED/SALT 설명 참고).

설치
----

본 챕터는 CMT의 시스템 요구사항, 다운로드, OS별 설치 절차, 업그레이드, 삭제 절차를 설명한다.

시스템 요구사항
^^^^^^^^^^^^^^^^^^

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 항목
      - 요구사항
    * - 운영체제
      - 64비트 Windows, 64비트 Linux
    * - Java
      - **Java 21 이상**. 배포 패키지에 OpenJDK 21 JRE가 번들로 포함되어 별도 설치 없이 실행 가능
    * - 메모리
      - 기본 JVM 힙은 ``-Xms1024M -Xmx4096M``\이다. 대용량 마이그레이션 시 GUI는 ``cubridmigration.ini``, 콘솔은 ``migration.sh`` / ``migration.bat``\에서 ``-Xmx`` 값을 조정한다.
    * - 디스크
      - 오프라인(파일) 마이그레이션 시 생성되는 출력 파일 크기에 맞는 여유 공간이 필요하다.

다운로드
^^^^^^^^^^^^

CMT 설치 파일은 다음 위치에서 받을 수 있다.

- 공식 다운로드: https://www.cubrid.com/downloads
- FTP 서버: http://ftp.cubrid.org/CUBRID_Tools/CUBRID_Migration_Toolkit/

운영 환경에 맞는 배포본을 선택한다.

.. list-table::
    :header-rows: 1
    :widths: 20 40 40

    * - 구분
      - 파일
      - 설명
    * - GUI (Windows)
      - ``CUBRID-Migration-Toolkit-<버전>-windows-x64.zip``
      - 압축 해제하여 사용
    * - GUI (Linux)
      - ``CUBRID-Migration-Toolkit-<버전>-linux-x86_64.tar.gz``
      - 압축 해제하여 사용
    * - 콘솔 (Windows)
      - ``CUBRID-Migration-Toolkit-console-<버전>-windows.zip``
      - GUI와 별도 패키지
    * - 콘솔 (Linux)
      - ``CUBRID-Migration-Toolkit-console-<버전>-linux.tar.gz``
      - GUI와 별도 패키지

설치 절차
^^^^^^^^^^^^

CMT는 별도의 설치 마법사 없이 압축본을 원하는 경로에 풀어 바로 실행한다.

Windows
""""""""""

1. 다운로드한 ``.zip`` 파일을 원하는 경로에 압축 해제한다.
2. 압축이 풀린 디렉토리의 ``cubridmigration.exe`` 파일을 실행한다.

Linux
""""""""

1. 다운로드한 ``.tar.gz`` 파일을 원하는 경로에 압축 해제한다.

   .. code-block:: bash

      tar -xzf CUBRID-Migration-Toolkit-<버전>-linux-x86_64.tar.gz -C <설치할 디렉토리>

   ``-C`` 는 압축을 풀 대상 디렉토리를 지정하는 ``tar`` 옵션이다. ``/opt`` 는 예시일 뿐이며, 사용자 계정으로 쓰기 가능한 경로에 설치해도 된다.

2. 압축이 풀린 디렉토리로 이동해 실행 파일을 실행한다.

   .. code-block:: bash

      cd <압축 해제된 CMT 디렉토리>
      ./cubridmigration

   Linux 데스크톱 환경에서는 파일 관리자에서 ``cubridmigration`` 실행 파일을 직접 실행할 수도 있다. 다만 데스크톱 환경마다 실행 파일 처리 방식과 권한 표시가 달라서, 운영 매뉴얼에서는 위와 같이 터미널 명령으로 기동하는 절차를 기준으로 설명한다.

업그레이드
^^^^^^^^^^^^

CMT는 자동 업데이트 기능을 내장하고 있다. 새 버전이 등록되면 CMT 실행 시 사용자에게 확인을 받고 자동으로 다운로드해 업그레이드를 수행한다.

수동으로 업그레이드하는 경우, 기존 설치 디렉토리는 그대로 두고 새 ``.zip`` 또는 ``.tar.gz``\를 동일한 경로에 풀어 덮어쓴다.

.. warning::
  수동 업그레이드 시 연결 정보 등이 포함된 **워크스페이스 디렉토리를 반드시 백업**\한다. CMT의 기본 워크스페이스는 설치 디렉토리 아래의 ``workspace/cmt/`` 이므로, 이 디렉토리를 복사해 둔다.

삭제
^^^^^^

CMT를 완전히 삭제하려면 설치 디렉토리를 직접 삭제한다. 기본 워크스페이스는 설치 디렉토리 하위의 ``workspace/cmt/`` 에 있으므로 설치 디렉토리를 삭제하면 함께 제거된다.

Windows
""""""""""

1. 파일 탐색기에서 CMT 설치 디렉토리(예: ``C:\CUBRID\cubridmigration``)를 삭제한다.
2. 연결 정보와 이력을 보존해야 한다면 삭제 전에 ``workspace\cmt\`` 디렉토리를 별도로 백업한다.

Linux
"""""

CMT 설치 디렉토리를 삭제한다.

.. code-block:: bash

   rm -rf <CMT 설치 디렉토리>

.. note::
  소스 코드에서 직접 빌드하는 방법은 본 매뉴얼 범위 밖이다. 자세한 빌드 절차는 GitHub 저장소(https://github.com/CUBRID/cubrid-migration)의 README를 참고한다.

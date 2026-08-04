# ca-manual (CUBRID Admin) 전용 리뷰 규칙

저장소 공통 규칙은 루트 `.greptile/rules.md`에 있습니다. 이 파일은 **거기에 더해지는** CA 매뉴얼 전용 규칙입니다.
(Greptile은 상위 디렉터리의 규칙과 이 파일의 규칙을 **합쳐서** 적용합니다. 덮어쓰지 않습니다.)

---

## 1. 제품 명칭

| 구분 | 표기 | 현재 본문 |
|:---|:---|:---:|
| 본문 표기 | `CUBRID Admin` | 127건 |
| 약어 | `CA` | |
| 금지 표기 | 큐브리드 어드민, CUBRID 관리자 도구, CUBRID Administrator, CUBRID admin | 0건 |

새로 작성하는 문장도 `CUBRID Admin`을 사용합니다.
사람 역할을 뜻하는 `관리자`, `DBA`는 일반명사이므로 그대로 사용합니다.

---

## 1-1. UI 메뉴 경로 — 가장 주의할 항목

CUBRID Admin은 GUI 도구입니다. 이 매뉴얼에는 **화면 메뉴 경로 인용**이 많습니다.

### 원칙

`.. rubric::` 메뉴 경로와 큰따옴표로 감싼 UI 라벨은 **화면 원문이므로 수정하지 않습니다.**

```rst
.. rubric:: "호스트 이름 (마우스 우클릭) > 속성 > 매개 변수 구성 (더블 클릭) > 서비스 구동 설정"
```

위 문장의 `매개 변수 구성`은 화면 메뉴명입니다.
공통 규칙 3번(`매개 변수 → 파라미터`)을 적용하면 **사용자가 메뉴를 찾지 못합니다.**

### 실제 사례

| 위치 | 문자열 | 처리 |
|:---|:---|:---|
| `env.rst:8` | `"사용 중인 매개 변수"` | UI 라벨 — 원문 유지 |
| `env.rst:14` | `"서버/클라이언트 매개 변수 정보 출력"` | UI 라벨 — 원문 유지 |
| `env.rst:95` | `.. rubric:: "... > 매개 변수 구성 ..."` | 메뉴 경로 — 원문 유지 |
| `env.rst:123` | `"설정 매개 변수"` | UI 라벨 — 원문 유지 |
| `env.rst:12` | `해당 데이터베이스에서 사용하는 매개 변수(parameter) 정보를 출력하며` | 서술 문장 — `파라미터`로 수정 |
| `admin.rst:764` | `해당 브로커의 SQL_LOG 매개 변수 값이 ON이면` | 서술 문장 — `파라미터`로 수정 |

판정이 애매하면 **UI 라벨로 간주해 원문을 유지**합니다.
잘못 바꾸는 손해가 안 바꾸는 손해보다 큽니다.

---

## 2. 표기 규칙을 적용하지 않는 대상

CA 매뉴얼은 명령어와 설정값 비중이 높습니다. 다음은 **제품 동작과 직결되므로 원문을 그대로 유지**합니다.

### 설정 파일 파라미터

`cubrid.conf`, `cubrid_broker.conf`, `cubrid_ha.conf`의 파라미터명과 값
예: `data_buffer_size`, `max_clients`, `ha_mode`, `error_log`, `SERVICE`, `BROKER_PORT`

### 유틸리티 명령어와 옵션

`cubrid service`, `cubrid server`, `cubrid broker`, `cubrid createdb`, `cubrid backupdb`,
`cubrid restoredb`, `cubrid checkdb`, `cubrid statdump`, `cubrid applyinfo`,
`cubrid_replay`, `broker_log_top`, `csql` 및 이들의 모든 실행 옵션

### 환경 변수

`CUBRID`, `CUBRID_DATABASES`, `CUBRID_MSG_LANG`, `CUBRID_TMP`, `LD_LIBRARY_PATH`, `PATH`

### 로케일·인코딩 옵션값

`ko_KR.euckr`, `ko_KR.utf8`, `en_US.iso88591`

> 인코딩 표기는 루트 규칙 3절을 따릅니다.
> **옵션값 자리에서는 항상 소문자·하이픈 없음**(`ko_KR.euckr`), **설명 문장에서는 IANA 표기**(`EUC-KR`).

### 출력 예시

`statdump`, `broker_log_top`, `plandump`, 오류 로그의 출력 지표명과 출력 블록 전체는
제품이 생성하는 문자열이므로 수정하지 않습니다.
예: `Num_data_page_fetches`, `Num_query_selects`, `LOCK ESCALATION`

### 시스템 카탈로그 식별자

`db_class`, `db_attribute`, `db_user`, `db_index` 등 카탈로그 이름과 그 칼럼명

---

## 3. 절차 문서 안전성

데이터 손실 가능성이 있는 절차는 다음을 갖추어야 합니다.

| 대상 절차 | 필수 요소 |
|:---|:---|
| `cubrid backupdb` / `restoredb` | 사전 조건(서비스 정지 여부), 백업 볼륨 위치, 복구 후 검증 방법 |
| `cubrid deletedb` | 되돌릴 수 없음을 알리는 `.. warning::` |
| HA 전환 / `cubrid heartbeat` | 전환 중 서비스 영향 범위 |
| 볼륨 추가·확장 | 디스크 여유 공간 조건 |

명령어만 제시되고 위 요소가 없으면 `.. warning::` 또는 `.. note::` 추가를 제안합니다.

### 금지 표현

관리 절차 설명에서 다음 표현은 사용하지 않습니다.

- `완벽한 복구`, `손실 없이 복구`, `100% 복구`, `절대 실패하지 않습니다`

권장 대안: `백업 시점까지 복구합니다`, `아카이브 로그가 보존된 범위 내에서 복구합니다`

---

## 4. 자주 발생하는 실수

| 상황 | 잘못된 수정 | 올바른 처리 |
|:---|:---|:---|
| 설정 파일 파라미터 설명 | `error_log` → `오류_log` | 파라미터명은 원문 유지, 설명 문장만 `오류 로그` |
| 인코딩 옵션값 | `ko_KR.euckr` → `ko_KR.EUC-KR` | 옵션값은 소문자 유지 |
| 설명 문장의 인코딩 | `euckr 인코딩을 지원합니다` 유지 | `EUC-KR 인코딩을 지원합니다`로 수정 |
| statdump 지표 설명 | 출력 지표명 한글화 | 지표명은 원문, 설명만 한글 |
| 디렉터리 경로 | `$CUBRID/디렉터리` | 경로는 원문 유지, 서술에서만 `디렉터리` |

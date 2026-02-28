# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# 현재 폴더의 모든 파일(mvnw 포함)을 복사
COPY . .

# 실행 권한을 부여하고, 프로젝트에 포함된 mvnw로 빌드 (로컬과 동일한 환경 구축)
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# 빌드된 jar 파일을 app.jar로 복사
COPY --from=build /app/target/*.jar app.jar

# 서버 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
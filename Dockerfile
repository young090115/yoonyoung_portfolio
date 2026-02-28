# 1. 빌드 스테이지 (JDK 25 사용)
FROM eclipse-temurin:25-jdk-noble AS build
WORKDIR /app

# 현재 폴더의 모든 파일을 복사
COPY . .

# mvnw 파일에 실행 권한을 주고 빌드 (로컬과 동일하게 자바 25로 빌드)
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# 2. 실행 스테이지 (JRE 25 사용)
FROM eclipse-temurin:25-jre-noble
WORKDIR /app

# 빌드된 jar 파일을 app.jar로 복사
COPY --from=build /app/target/*.war app.jar

# 서버 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
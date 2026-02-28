# 1. 빌드 스테이지
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY . .
# 메이븐 빌드 명령어 (테스트 생략하고 빌드)
RUN mvn clean package -DskipTests

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# 메이븐은 빌드 결과물이 target 폴더에 생성됩니다.
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
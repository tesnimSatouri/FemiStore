
FROM openjdk:17
WORKDIR /app
EXPOSE 8089
COPY target/Gestion_avis-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
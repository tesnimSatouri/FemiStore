FROM  openjdk:17
EXPOSE 8084
ADD target/FemiStore-0.0.1-SNAPSHOT.jar femistore.jar
ENTRYPOINT ["java","-jar", "femistore.jar"]

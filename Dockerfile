FROM openjdk:17
EXPOSE 8084
ADD target/gestion_commandes-0.0.1-SNAPSHOT.jar gestion_commandes.jar
ENTRYPOINT ["java", "-jar", "gestion_commandes.jar"]
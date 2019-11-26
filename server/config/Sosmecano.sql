#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: COMPANY
#------------------------------------------------------------

CREATE TABLE COMPANY(
        id_co          int (11) Auto_increment  NOT NULL ,
        name_co        Varchar (50) NOT NULL ,
        siret          Varchar (50) NOT NULL ,
        naf            Varchar (50) NOT NULL ,
        kbis           Varchar (2000) NOT NULL ,
        address_co     Varchar (250) NOT NULL ,
        postal_code_co Varchar (6) NOT NULL ,
        city_co        Varchar (30) NOT NULL ,
        boss_co        Varchar (50) NOT NULL ,
        creation_co    Date NOT NULL ,
        email_co       Varchar (70) NOT NULL ,
        password_co    Varchar (25) NOT NULL ,
        website_co     Varchar (25) ,
        id_ad          Int ,
        PRIMARY KEY (id_co )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: CAR
#------------------------------------------------------------

CREATE TABLE CAR(
        id_car        int (11) Auto_increment  NOT NULL ,
        car_brand     Varchar (50) NOT NULL ,
        car_version   Varchar (50) NOT NULL ,
        car_model     Varchar (50) NOT NULL ,
        in_service    Date NOT NULL ,
        photo_car     Varchar (2000) ,
        engine        Varchar (50) NOT NULL ,
        license_plate Varchar (25) NOT NULL ,
        serial_number Varchar (100) NOT NULL ,
        id_user       Int ,
        PRIMARY KEY (id_car )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: USER
#------------------------------------------------------------

CREATE TABLE USER(
        id_user          int (11) Auto_increment  NOT NULL ,
        name_user        Varchar (30) NOT NULL ,
        first_name_user  Varchar (30) NOT NULL ,
        tel_user         Varchar (30) NOT NULL ,
        address_user     Varchar (50) NOT NULL ,
        postal_code_user Varchar (6) NOT NULL ,
        city_user        Varchar (30) NOT NULL ,
        photo_user       Varchar (2000) ,
        email_user       Varchar (50) NOT NULL ,
        password_user    Varchar (30) NOT NULL ,
        PRIMARY KEY (id_user )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: AD
#------------------------------------------------------------

CREATE TABLE AD(
        id_ad          int (11) Auto_increment  NOT NULL ,
        longitude      Float ,
        token          Varchar (1000) ,
        description_ad Varchar (2000) ,
        accept_ad      Bool ,
        name_ad        Varchar (50) ,
        date_ad        Date ,
        type_ad        Varchar (30) ,
        photo_ad       Varchar (2000) ,
        latitude       Float ,
        distance       Float ,
        repair_date    Date ,
        id_user        Int ,
        id_co          Int NOT NULL ,
        id_car         Int ,
        PRIMARY KEY (id_ad )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: SCHEDULE
#------------------------------------------------------------

CREATE TABLE SCHEDULE(
        id_schedule   int (11) Auto_increment  NOT NULL ,
        night_service Bool NOT NULL ,
        day           Varchar (25) ,
        opening_time  Time ,
        closing_time  Time ,
        id_co         Int NOT NULL ,
        PRIMARY KEY (id_schedule )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: RATING
#------------------------------------------------------------

CREATE TABLE RATING(
        description_rating Varchar (1000) ,
        date_rating        Date ,
        rating             Numeric ,
        id_user            Int NOT NULL ,
        id_co              Int NOT NULL ,
        PRIMARY KEY (id_user ,id_co )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: QUOTE
#------------------------------------------------------------

CREATE TABLE QUOTE(
        price_estimate    Varchar (100) NOT NULL ,
        date_quote        Date NOT NULL ,
        description_quote Varchar (1000) NOT NULL ,
        name_quote        Varchar(200) NOT NULL,
        id_co             Int NOT NULL ,
        id_ad             Int NOT NULL ,
        PRIMARY KEY (id_co ,id_ad )
)ENGINE=InnoDB;

ALTER TABLE COMPANY ADD CONSTRAINT FK_COMPANY_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);
ALTER TABLE CAR ADD CONSTRAINT FK_CAR_id_user FOREIGN KEY (id_user) REFERENCES USER(id_user);
ALTER TABLE AD ADD CONSTRAINT FK_AD_id_user FOREIGN KEY (id_user) REFERENCES USER(id_user);
ALTER TABLE AD ADD CONSTRAINT FK_AD_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
ALTER TABLE AD ADD CONSTRAINT FK_AD_id_car FOREIGN KEY (id_car) REFERENCES CAR(id_car);
ALTER TABLE SCHEDULE ADD CONSTRAINT FK_SCHEDULE_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
ALTER TABLE RATING ADD CONSTRAINT FK_RATING_id_user FOREIGN KEY (id_user) REFERENCES USER(id_user);
ALTER TABLE RATING ADD CONSTRAINT FK_RATING_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_co FOREIGN KEY (id_co) REFERENCES COMPANY(id_co);
ALTER TABLE QUOTE ADD CONSTRAINT FK_QUOTE_id_ad FOREIGN KEY (id_ad) REFERENCES AD(id_ad);


# DietOn

Documentation Link : https://documenter.getpostman.com/view/17384187/UVCCe49d

Figma : https://www.figma.com/file/1qFQRolKF2GJ9Wvg6FsvpG/Diet-On?

![WhatsApp Image 2021-11-29 at 4 53 21 PM](https://user-images.githubusercontent.com/46044060/143911825-78c75bdc-9bbc-4acb-82da-6fdb4a87ee59.jpeg)

#### TECH STACK USED (Back End)
![image](https://user-images.githubusercontent.com/46044060/143916279-2d7e3207-cc03-4b40-9c14-03586f4022c0.png)

#### What is DietOn?
An App that controls users Diet Progress. Users can check their Weight and Measurement progress, set how many Calorie can consume, set Meal Plan and Exercise Plan for check how many Calorie has consumed

#### Next Feature
- Reminder feature for Exercise Plan and Meals Plan
- Auto List or Recommended Meals and Exercise Plan for users (based on BMI)
- Stream Exercise Video Feature
- Community feature (user can sharing about their progress with other user)

#### HOW TO RUN IN LOCAL
- After clone this repo run npm install
- For create database ---> npx sequelize db:create  
- For migrate database ---> npx sequelize db:migrate
- For seeding all mock up date ---> npx sequelize db:seed:all

#### HOW TO RUN USING ENDPOIT HAS BEEN DEPLOYED
- Use email and password below
- Cek documentation for detail each Endpoint

#### HOW TO RUN UNIT TESTING
- After clone this repo run npm install
- If not installed Jest and Supertest, install manual for the devDependencies
- for create test database ---> npx cross-env NODE_ENV=test npx sequelize-cli db:create
- for migrate test database ---> npx cross-env NODE_ENV=test npx sequelize-cli db:migrate
- for seeding all test database ---> npx cross-env NODE_ENV=test npx sequelize-cli db:seed:all


#### Data Admin
email : admin@gmail.com

password : admindieton

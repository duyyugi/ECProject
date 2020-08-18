'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let data = [{
                username: "student1",
                password: "$2a$10$dVNv7OKG/L2frHcRd6Jj1OXjQ6aOiHBEjz08AQ94tY4YslRfk7L9S",
                name: "Nguyễn Văn Đức",
                email: "student1@gmail.com",
                avatar: "/img/users/avatars/avatar1.jpg",
                description: "Làm việc tại công ty XYZ",
                phone: "0123456789",
                dateOfBirth: "10/11/1999",
                roleID: 1,
                banned: true
            },
            {
                username: "student2",
                password: "$2a$10$dVNv7OKG/L2frHcRd6Jj1OXjQ6aOiHBEjz08AQ94tY4YslRfk7L9S",
                name: "Trần Văn Bình",
                email: "student2@gmail.com",
                avatar: "/img/users/avatars/avatar2.jpg",
                description: "Làm việc tại công ty ABC",
                phone: "0123456788",
                dateOfBirth: "11/11/1987",
                roleID: 1,
                banned: false
            },
            {
                username: "teacher1",
                password: "$2a$10$dVNv7OKG/L2frHcRd6Jj1OXjQ6aOiHBEjz08AQ94tY4YslRfk7L9S",
                name: "Đào Đức Bá",
                email: "teacher1@gmail.com",
                avatar: "/img/users/avatars/avatar3.jpg",
                description: "Làm việc tại công ty KMS",
                phone: "0123456787",
                dateOfBirth: "10/11/1976",
                roleID: 2,
                banned: false
            },
            {
                username: "teacher2",
                password: "$2a$10$dVNv7OKG/L2frHcRd6Jj1OXjQ6aOiHBEjz08AQ94tY4YslRfk7L9S",
                name: "Trương Quang Duy",
                email: "teacher2@gmail.com",
                avatar: "/img/users/avatars/avatar4.jpg",
                description: "Giảng viên KhoaPham.vn",
                phone: "0123456780",
                dateOfBirth: "5/6/1980",
                roleID: 2,
                banned: false
            },
            {
                username: "teacher3",
                password: "123456",
                name: "Hoàng Văn Bình",
                email: "teacher3@gmail.com",
                avatar: "/img/users/avatars/avatar5.jpg",
                description: "Làm việc tại công ty VietHas",
                phone: "0123456780",
                dateOfBirth: "5/6/1980",
                roleID: 2,
                banned: false
            },
            {
                username: "teacher4",
                password: "123456",
                name: "Nguyễn Duy Nghĩa",
                email: "teacher4@gmail.com",
                avatar: "/img/users/avatars/avatar6.ipg",
                description: "Làm việc tại công ty FPT",
                phone: "0123456780",
                dateOfBirth: "5/6/1980",
                roleID: 2,
                banned: false
            },
            {
                username: "teacher5",
                password: "123456",
                name: "Trần Văn Tâm",
                email: "teacher5@gmail.com",
                avatar: "/img/users/avatars/avatar7.png",
                description: "Làm việc tại công ty VNG",
                phone: "0123456780",
                dateOfBirth: "5/6/1980",
                roleID: 2,
                banned: true
            },
            {
                username: "manager1",
                password: "$2a$10$dVNv7OKG/L2frHcRd6Jj1OXjQ6aOiHBEjz08AQ94tY4YslRfk7L9S",
                name: "Trương Quang Lộc",
                email: "manager1@gmail.com",
                avatar: "/img/users/avatars/avatar8.jpg",
                description: "",
                phone: "0999999999",
                dateOfBirth: "5/8/1981",
                roleID: 3,
                banned: false
            },
            {
                username: "staffcare1",
                password: "123456",
                name: "Nguyễn Duy Tiến",
                email: "staffcare1@gmail.com",
                avatar: "/img/users/avatars/avatar9.jpg",
                description: "nhan vien bo phan 1",
                phone: "0125666412",
                dateOfBirth: "5/8/1993",
                roleID: 4,
                banned: true
            },
            {
                username: "staffcare2",
                password: "123456",
                name: "Nguyễn Minh Hiền",
                email: "staffcare2@gmail.com",
                avatar: "/img/users/avatars/avatar10.jpg",
                description: "nhan vien bo phan 2",
                phone: "0125666413",
                dateOfBirth: "5/8/1995",
                roleID: 4,
                banned: false
            },
        ];
        data.map(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
            return item;
        });
        return queryInterface.bulkInsert('Users', data, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    }
};
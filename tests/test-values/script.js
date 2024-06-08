import {
    ref,
    computed,
    method,
    onMounted,
    onCreated,
    mount,
    template,
} from "../../Dome2/dome.js";

const input = ref(["input"], "");
const login = ref(["login"], "");
const avatarUrl = ref(["avatarUrl"], "");
const bio = ref(["bio"], "");
const createdAt = ref(["createdAt"], "");
const location = ref(["location"], "");
const followers = ref(["followers"], {
    followersCount: 0,
    followersUrls: "",
    followersArray: []
});
const following = ref(["following"], {
    followingCount: 0,
    followingUrls: "",
    followingArray: []
});
const repos = ref(["repos"], []);
const monthes = ref(["monthes"], ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"]);
const followersOpen = ref(["followersOpen"], false);
const followingOpen = ref(["followingOpen"], false);
const reposOpen = ref(["reposOpen"], false);

method('openFollowers', () => {
    followersOpen.value = !followersOpen.value;
});

method('openFollowing', () => {
    followingOpen.value = !followingOpen.value;
});

method('openRepos', () => {
    reposOpen.value = !reposOpen.value;
});

method('search', () => {
    fetch(`https://api.github.com/users/${input.value}`)
        .then((res, rej) => {
            return res.json()
        }).then(githubUser => {
            if (githubUser.message == "Not Found") {
                return new Error("БЛЯТ!")
            }
            avatarUrl.value = githubUser.avatar_url;
            login.value = githubUser.login;
            bio.value = githubUser.bio;
            createdAt.value = githubUser.created_at;
            followers.value.followersCount = githubUser.followers;
            followers.value.followersUrls = githubUser.followers_url;
            following.value.followingCount = githubUser.following;
            following.value.followingUrls = githubUser.following_url;
        }).then(() => {
            fetch(followers.value.followersUrls)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    followers.value.followersArray = res
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${input.value}/following`)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    following.value.followingArray = res
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${login.value}/repos`)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    repos.value = res;
                })
        }).then(() => {
            input.value = ""
        })
});

method('goTo', (log) => {
    fetch(`https://api.github.com/users/${log}`)
        .then((res) => {
            return res.json()
        }).then(githubUser => {
            if (githubUser.message == "Not Found") {
                return new Error("БЛЯТ!")
            }
            avatarUrl.value = githubUser.avatar_url;
            login.value = githubUser.login;
            bio.value = githubUser.bio;
            createdAt.value = githubUser.created_at;
            followers.value.followersCount = githubUser.followers;
            followers.value.followersUrls = githubUser.followers_url;
            following.value.followingCount = githubUser.following;
            following.value.followingUrls = githubUser.following_url;
        }).then(() => {
            fetch(followers.value.followersUrls)
                .then((res) => {
                    return res.json();
                }).then((res) => {
                    followers.value.followersArray = res;
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${log}/following`)
                .then((res) => {
                    return res.json();
                }).then((res) => {
                    following.value.followingArray = res;
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${log}/repos`)
                .then((res) => {
                    return res.json();
                }).then((res) => {
                    repos.value = res;
                })
        })
});

computed('created', () => {
    let date = new Date(createdAt.value);
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    return `${day} ${monthes.value[month]} ${year} года`
}, [createdAt]);

computed('openCloseFollowers', () => {
    if (!followersOpen.value) {
        return "Раскрыть";
    }
    return "Скрыть";
}, [followersOpen]);

computed('openCloseFollowing', () => {
    if (!followingOpen.value) {
        return "Раскрыть";
    }
    return "Скрыть";
}, [followingOpen]);

computed('openCloseRepos', () => {
    if (!reposOpen.value) {
        return "Показать";
    }
    return "Скрыть";
}, [reposOpen]);

onCreated(() => {
    fetch("https://api.github.com/users/LegionLiner")
        .then((res) => {
            return res.json()
        }).then(githubUser => {
            avatarUrl.value = githubUser.avatar_url;
            login.value = githubUser.login;
            bio.value = githubUser.bio;
            createdAt.value = githubUser.created_at;
            followers.value.followersCount = githubUser.followers;
            followers.value.followersUrls = githubUser.followers_url;
            following.value.followingCount = githubUser.following;
            following.value.followingUrls = githubUser.following_url;
            location.value = githubUser.location;
        }).then(() => {
            fetch(followers.value.followersUrls)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    followers.value.followersArray = res;
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${login.value}/following`)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    following.value.followingArray = res;
                })
        }).then(() => {
            fetch(`https://api.github.com/users/${login.value}/repos`)
                .then((res) => {
                    return res.json()
                }).then((res) => {
                    repos.value = res;
                })
        })
})

template(`
      <header>
        <h1 d-text="login"></h1>
        <input d-text="input">
        <button d-on="click: search">&#128269;</button>
        <img d-bind="src: avatarUrl" alt="">
      </header>
      <main>
    <div class="description">
        <h2>Логин: <span d-text="login"></span></h2>
        <p>Статус: <span d-text="bio"></span></p>
        <p>Дата создания: <span d-text="created"></span></p>
    </div>
    <div class="wrapper">
    <div class="followers">
        <p>Подписчиков: <span d-text="followers.followersCount"></span></p>
        <ul> <span d-on="click: openFollowers"><span d-text="openCloseFollowers"></span> список подписчиков</span>
        <div d-if="followersOpen">
            <li d-for="item in followers.followersArray">
                <h3><span d-text="item.login"></span></h3>
                <img d-bind="src: item.avatar_url">
                <button d-on="click: goTo(item.login)">Перейти</button>
            </li>
            </div>
        </ul>
        </div>
    <div class="following">
        <p>Подписок: <span d-text="following.followingCount"></span></p>
        <ul> <span d-on="click: openFollowing"><span d-text="openCloseFollowing"></span> список подписок</span>
        <div d-if="followingOpen">
            <li d-for="item in following.followingArray">
            <h3><span d-text="item.login"></span></h3>
            <img d-bind="src: item.avatar_url">
            <button d-on="click: goTo(item.login)">Перейти</button>
            </li>
        </div>
        </ul>
    </div>
    </div>
    <div class="repos">
    <p d-on="click: openRepos"><span d-text="openCloseRepos"></span> репозитории</p>
    <div d-if="reposOpen">
        <div class="repo" d-for="rep in repos">
            <h2><span d-text="rep.full_name"></span></h2>
            <h3>Имя: <span d-text="rep.name"></span></h3>
            <p>Описание: <span d-text="rep.description"></span></p>
            <p class="lang">Язык: <span d-text="rep.language"></span></p>
            <a d-bind="href: rep.html_url" target="_blank">Ссылка</a>
        </div>
    </div>
    </div>
    </main>
`, ".github");

mount('.github');
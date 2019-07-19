import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  	state: {
		finalInfo: {
			hotelInfo: {},
			contacts : {}
		}
 	},
  	mutations: {
		setContacts(state, obj) {
			state.finalInfo.contacts = obj
		},
		setHotelInfo(state, obj) {
			state.finalInfo.hotelInfo = obj
		}
  	},
  	actions: {
		//   отправляем форму
		sendForm(context) {
			const url = 'http://localhost:8080/';
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(context.state.finalInfo),
				headers:{
					'Content-Type': 'application/json'
				}
			}).then(res=>{
				if (res.status === 200) {
					// данные из формы успешно отправлены, вывести сообщение от успешной отправке/сделать переход на какую-то страницу и т.д.
				} else {
					// обработать ответ от сервера в зависимости от ошибки
				}
			}).catch(err=>{
				// обработать ответ от сервера в зависимости от ошибки
			});
		}
  	}
})
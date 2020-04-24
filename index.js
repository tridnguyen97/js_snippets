const _ = require('lodash')
const axios = require('axios')

//
urls = ["https://www.google.com/","https://www.facebook.com/","https://github.com/"]
results = _.chunk(urls,2)
console.log(results)


// Promise.all with map

const promises = 
	_.map(urls,(url) => {
		axios.get(url)
		.then(res => {
			console.log(res.status)
			return Promise.resolve(res.status)		
		})
		.catch(err => {
			return Promise.reject(err)
		})
})

Promise.all(promises)

// applying 2 methods with rate limiting by using Bottleneck
const Bottleneck = require('bottleneck')

const limiter = new Bottleneck({
  minTime: 1000
});

console.time("Promise all")

_.forEach(results,result => {
	const promises = 
	_.map(result,(url) => {
		return limiter.schedule(() =>
			axios.get(url)
			.then(res => {
				console.log(res.status)
				return Promise.resolve(res.status)		
			})
			.catch(err => {
				return Promise.reject(err)
			})
		)
	})
	
	Promise.all(promises)
	
})
console.timeEnd("Promise all")	
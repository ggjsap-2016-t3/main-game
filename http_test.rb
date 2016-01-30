require 'net/http'
require 'json'

req = Net::HTTP::Post.new '/'
params = {result: {user: "mktakuya", left: 15}}
req.body = params.to_json
puts "BODY\n#{req.body}"
res = Net::HTTP.start('localhost', 9393) { |http| http.request req }
puts res


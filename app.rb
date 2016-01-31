require 'sinatra/base'
require 'sinatra/contrib'
require "sinatra/reloader"
require 'active_support/core_ext/integer/inflections'
require 'slim'
require 'yaml'
require 'sequel'
require 'json'

class RankingServer < Sinatra::Base
  register Sinatra::Contrib

	configure :development do
		register Sinatra::Reloader
	end

	get '/' do
		File.read(File.join('public', 'index.html'))
	end

  post '/', provides: :json do
    if ENV['DATABASE_URL'].nil?
      connect_opt = YAML.load_file("./config/config.yml")
      DB = Sequel.postgres('ggjsap2016-t3', connect_opt)
    else
      DB = Sequel.connect(ENV['DATABASE_URL'])
    end

		result = JSON.parse(request.body.read)["result"]

    unless DB.table_exists?(:results)
      DB.create_table :results do
        String :user, primary_key: true
        Integer :left
      end
    end

		# UPSERT
    DB.transaction do
			old_data = DB[:results].where(user: result["user"]).first
			if old_data.nil?
				DB[:results].insert(user: result["user"], left: result["left"])
			elsif result["left"] > old_data[:left]
				DB[:results].where(user: result["user"]).update(left: result["left"])
			end
		end

    DB.disconnect
		"OK"
  end

  get '/ranking' do
    if ENV['DATABASE_URL'].nil?
      connect_opt = YAML.load_file("./config/config.yml")
      DB = Sequel.postgres('ggjsap2016-t3', connect_opt)
    else
      DB = Sequel.connect(ENV['DATABASE_URL'])
    end

    @title = "Ranking"
    @results = DB[:results].order(Sequel.desc(:left)).limit(10).all
    DB.disconnect
    slim :ranking
  end

  helpers do
    def page_title(title = nil)
      @title = title if title
      @title ? "#{@title} - Roque" : "Roque - GGJSAP 2016 Team3"
    end

    def ordinalize(number)
      number.ordinalize
    end
  end
end


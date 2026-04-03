FactoryBot.define do
  factory :author do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    bio { Faker::Lorem.paragraph }
    birth_year { rand(1900..2000) }
    death_year { nil }
    website { Faker::Internet.url }

    trait :deceased do
      death_year { birth_year + rand(40..90) }
    end

    trait :without_bio do
      bio { nil }
    end
  end
end

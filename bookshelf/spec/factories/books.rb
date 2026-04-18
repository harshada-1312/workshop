FactoryBot.define do
  factory :book do
    title { Faker::Book.title }
    author
    genre { Book::ALLOWED_GENRES.sample }
    language { "en" }
    read_status { "unread" }
    date_added { Time.current }

    trait :with_isbn do
      sequence(:isbn) do |n|
        # Generate a valid ISBN-13 with correct check digit
        prefix = format("978000000%04d", n)
        digits = prefix.first(12).chars.map(&:to_i)
        sum = digits.each_with_index.sum { |d, i| i.even? ? d : d * 3 }
        check = (10 - (sum % 10)) % 10
        "#{prefix.first(12)}#{check}"
      end
    end

    trait :read do
      read_status { "read" }
    end

    trait :reading do
      read_status { "reading" }
    end

    trait :unread do
      read_status { "unread" }
    end

    trait :rated do
      rating { [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].sample }
    end

    trait :unrated do
      rating { nil }
    end
  end
end

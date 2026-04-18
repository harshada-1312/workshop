require 'rails_helper'

RSpec.describe Author, type: :model do
  subject { build(:author) }

  describe 'associations' do
    it { is_expected.to have_many(:books) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:first_name) }
    it { is_expected.to validate_presence_of(:last_name) }
    it { is_expected.to validate_length_of(:first_name).is_at_most(100) }
    it { is_expected.to validate_length_of(:last_name).is_at_most(100) }
    it { is_expected.to validate_length_of(:bio).is_at_most(2000) }
  end

  describe 'custom validations' do
    it 'saves a valid author successfully' do
      author = build(:author)
      expect(author).to be_valid
    end

    it 'is invalid without first_name' do
      author = build(:author, first_name: nil)
      expect(author).not_to be_valid
      expect(author.errors[:first_name]).to include("can't be blank")
    end

    it 'is invalid without last_name' do
      author = build(:author, last_name: nil)
      expect(author).not_to be_valid
      expect(author.errors[:last_name]).to include("can't be blank")
    end

    it 'is invalid when bio exceeds 2000 characters' do
      author = build(:author, bio: 'a' * 2001)
      expect(author).not_to be_valid
      expect(author.errors[:bio]).to be_present
    end

    it 'is invalid when birth_year is in the future' do
      author = build(:author, birth_year: Date.current.year + 1)
      expect(author).not_to be_valid
      expect(author.errors[:birth_year]).to be_present
    end

    it 'is invalid when death_year is before birth_year' do
      author = build(:author, birth_year: 1950, death_year: 1940)
      expect(author).not_to be_valid
      expect(author.errors[:death_year]).to be_present
    end

    it 'is valid with a proper URL website' do
      author = build(:author, website: 'https://example.com')
      expect(author).to be_valid
    end

    it 'is invalid with a malformed website' do
      author = build(:author, website: 'not-a-url')
      expect(author).not_to be_valid
      expect(author.errors[:website]).to include('must be a valid URL')
    end

    it 'allows blank website' do
      author = build(:author, website: '')
      expect(author).to be_valid
    end
  end

  describe 'deletion protection' do
    it 'cannot delete author with books' do
      author = create(:author)
      create(:book, author: author, genre: 'Fiction')
      expect { author.destroy! }.to raise_error(ActiveRecord::RecordNotDestroyed)
    end
  end

  describe 'sanitization' do
    it 'strips leading and trailing whitespace from first_name' do
      author = create(:author, first_name: '  John  ')
      expect(author.first_name).to eq('John')
    end

    it 'strips leading and trailing whitespace from last_name' do
      author = create(:author, last_name: '  Doe  ')
      expect(author.last_name).to eq('Doe')
    end

    it 'strips HTML tags from bio' do
      author = create(:author, bio: '<b>Bold</b> text <script>alert("xss")</script>')
      expect(author.bio).to eq('Bold text alert("xss")')
    end
  end
end

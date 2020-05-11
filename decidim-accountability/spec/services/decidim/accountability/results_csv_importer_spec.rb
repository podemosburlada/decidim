# coding: utf-8
# frozen_string_literal: true

require "spec_helper"
require "decidim/core/test/factories"
require "decidim/accountability/test/factories"
require "decidim/participatory_processes/test/factories"

describe Decidim::Accountability::ResultsCSVImporter do
  let(:organization) { create :organization, available_locales: [:en] }
  let(:current_user) { create :user, organization: organization }
  let(:participatory_process) { create :participatory_process, organization: organization }
  let(:current_component) { create :accountability_component, participatory_space: participatory_process }
  let(:valid_csv) { File.read("spec/fixtures/valid_result.csv") }
  let(:invalid_csv) { File.read("spec/fixtures/invalid_result.csv") }

  context "with a valid CSV" do
    subject { described_class.new(current_component, valid_csv, current_user) }

    describe "#import!" do
      it "Import all rows from csv file" do
        expect do
          subject.import!
        end.to change(Decidim::Accountability::Result, :count).by(39)
      end

      context "when results exist" do
        let!(:result1) { create :result, component: current_component, progress: 0, id: 73 }

        it "Update the result1 progress attribute" do
          subject.import!

          expect(result1.reload.progress.to_f).to eq 25
        end
      end
    end
  end

  context "with an invalid CSV" do
    subject { described_class.new(current_component, invalid_csv, current_user) }

    describe "#import!" do
      it "Errors would be returned" do
        errors = subject.import!

        expect(errors.length).to eq 3
      end
    end
  end
end

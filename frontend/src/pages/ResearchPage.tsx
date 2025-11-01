import React from 'react'
import Card from '../components/Card'
import CardTitle from '../components/CardTitle'

const ResearchPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-red-700 pb-2">
        Research
      </h1>
      <Card>
        <CardTitle>Mission</CardTitle>
        <p>
          We study how and why organisms age — and how to measure, map, and modulate this process. Our work spans quantitative biomarkers of biological age, mechanisms of rejuvenation, genetics of exceptional longevity, and the interface between aging and disease, grounded in decades of expertise in redox and selenium biology.
        </p>
      </Card>

      <Card>
        <CardTitle>What we study</CardTitle>
        <p className="font-bold pt-4">Measuring biological age</p>
        <p>
          We benchmark and refine multi-omics aging “clocks” (DNA methylation, transcriptome, proteome) and publish guidance on how to measure biological aging in humans.
        </p>
        <p className="font-bold pt-4">Rejuvenation biology</p>
        <p>
          We investigate natural and induced rejuvenation—from the embryonic rejuvenation event during early development to partial cellular reprogramming.
        </p>
        <p className="font-bold pt-4">Genetics of longevity</p>
        <p>
        We analyze centenarians and long-lived organisms to identify protective architectures that contribute to exceptional lifespan.
        </p>
        <p className="font-bold pt-4">Aging → disease links</p>
        <p>
          We map age-associated cellular states that drive pathology, such as age-associated clonal B cells that progress to lymphoma.
        </p>
        <p className="font-bold pt-4">Redox & selenium biology</p>
        <p>
          Our lab has a long track record defining mammalian selenoproteins and redox pathways that shape health and aging.
        </p>
        <p className="font-bold pt-4">Brain aging</p>
        <p>
          We probe brain aging through neuroimmune and glial mechanisms, using microglia-replacement models and longitudinal brain imaging in mice. In humans, we deploy connectome-based brain-age modeling to identify deviations, risks and resilience patterns.
        </p>

        <p className="font-bold pt-4">Reproductive aging</p>
        <p>
          We focus on why the reproductive system ages early and how that links to whole-body aging. Our work includes ovarian aging biomarkers, multi-omics atlases of reproductive tissues, and investigations of the embryonic rejuvenation reset.
        </p>

        <p className="font-bold pt-4">Replacement</p>
        <p>
          We use heterochronic replacement experiments—swapping young and old organs, cells or environments—to test causality in aging. These models help distinguish organ-intrinsic aging from systemic drivers and inform rejuvenation strategies.
        </p>

      </Card>

      <Card>
        <CardTitle>How we work</CardTitle>
        <p>
          We combine multi-omics experiments (bulk & single-cell), cross-species analyses, and computational modeling to derive interpretable, testable insights—often validating findings across mice, humans, and other mammals. 
        </p>
      </Card>
    </div>
  )
}

export default ResearchPage

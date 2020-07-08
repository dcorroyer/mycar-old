<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 *
 * @ApiResource(
 *      collectionOperations={"GET", "POST"},
 *      itemOperations={"GET", "PUT", "PATCH", "DELETE"},
 *      subresourceOperations={
 *          "api_maintenances_invoices_get_subresource"={
 *              "normalization_context"={"groups"={"invoices_subresource"}}
 *          }
 *      },
 *      attributes={
 *          "order": {"chrono":"ASC"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoices_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      }
 * )
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "maintenances_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "maintenances_read", "invoices_subresource"})
     */
    private $filename;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Maintenance", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="La maintenance liée à la facture est obligatoire")
     */
    private $maintenance;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "maintenances_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le chrono de la facture est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): self
    {
        $this->filename = $filename;

        return $this;
    }

    public function getMaintenance(): ?Maintenance
    {
        return $this->maintenance;
    }

    public function setMaintenance(?Maintenance $maintenance): self
    {
        $this->maintenance = $maintenance;

        return $this;
    }

    /**
     * @return Vehicule|null
     * @Groups({"invoices_read"})
     * @ApiSubresource()
     */
    public function getVehicule(): ?Vehicule
    {
        return $this->getMaintenance()->getVehicule();
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
